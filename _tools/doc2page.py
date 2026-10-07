#!/usr/bin/env python3
"""Convert a Markdown export of a 'Website text' doc tab into a Jekyll page.

Usage:  python3 doc2page.py <page> <exported-tab.md> [publications-tab.md]
  <page> is one of: home, research, publications, teaching, or a course page name
  such as course-percolation-2025. Citations are resolved against the Publications
  tab export (or _data/publications.yml if no export is given).
Writes <file>.md (and _data/publications.yml for the publications page) into the
current directory. Conventions are described in the doc's Read me tab.
"""
import re, sys, os, json

PAGES = {
  "home":         dict(file="index.md", title="Tejas Iyer", nav="home", photo="photo.jpg"),
  "research":     dict(file="research.md", title="Research", nav="research", sims=True, body_class="research",
                       description="Research of Tejas Iyer: phase transitions in reinforced growth processes, random trees, coagulation and branching processes, with interactive simulations."),
  "publications": dict(file="publications.md", title="Publications", nav="publications"),
  "teaching":     dict(file="teaching.md", title="Teaching", nav="teaching"),
}
SIMS = {"urns":"sim-urns", "preferential-attachment tree":"sim-pa-tree", "learners":"sim-learners",
        "gelation":"sim-gelation", "condensation":"sim-condensation", "explosion":"sim-explosion", "varying":"sim-varying", "self-training":"sim-selftrain", "superlinear":"sim-superlinear",
        "bandits":"sim-bandits", "phases":"sim-phases"}

INLINE_CAPTION = {"phases"}   # captions rendered inside the figure

def unescape(t):
    t = re.sub(r"&#(\d+);", lambda m: chr(int(m.group(1))), t)
    t = "\n".join(l.rstrip() for l in t.split("\n"))
    return re.sub(r"\\([\[\]_*#|()&<>!+.\-])", r"\1", t)

def read_table(md):
    rows = [l for l in md.splitlines() if l.strip().startswith("|")]
    if len(rows) < 3: return []
    split = lambda r: [c.strip() for c in r.strip().strip("|").split("|")]
    head = [h.lower() for h in split(rows[0])]
    return [dict(zip(head, split(r))) for r in rows[2:]]

def pubs_from_md(md):
    out = []
    for r in read_table(unescape(md)):
        links = [dict(label=a, url=b) for a, b in re.findall(r"\[([^\]]+)\]\(([^)]+)\)", r.get("links", ""))]
        themes = [t.strip() for t in r.get("themes", "").split(",") if t.strip()]
        out.append(dict(id=r["id"], year=int(r["year"]), type=r["type"], authors=r["authors"],
                        title=r["title"], venue=r["venue"], links=links, themes=themes, cite=r.get("cite label", "")))
    order = {"Preprint": 0, "Journal": 1, "Thesis": 2}
    return sorted(out, key=lambda p: (order.get(p["type"], 3), -p["year"]))

def pubs_from_yml(path):
    # minimal reader for the YAML this script writes (one JSON object per entry)
    return [json.loads(l[2:]) for l in open(path, encoding="utf-8") if l.startswith("- {")]

def write_yml(pubs, path):
    with open(path, "w", encoding="utf-8") as f:
        f.write("# Generated from the Publications tab of the 'Website text' doc.\n")
        for p in pubs: f.write("- " + json.dumps(p, ensure_ascii=False) + "\n")

def powers(t):
    t = re.sub(r"\^\(([^()]*)\)", r"<sup>\1</sup>", t)
    return re.sub(r"\^([^\s,.;:()\]</]+)", r"<sup>\1</sup>", t)

def convert(page, md, pubs):
    md = unescape(md).replace("\r\n", "\n")
    labels = {p["id"]: p["cite"] or str(p["year"]) for p in pubs}
    def cite(m):
        pid = m.group(1).strip()
        if pid not in labels: sys.exit(f"Unknown citation id: {pid}")
        return f'<a class="cite" href="publications.html#{pid}">[{labels[pid]}]</a>'
    def pagelink(m):
        target, _, text = m.group(1).partition("|")
        target = target.strip(); text = text.strip() or target
        href = "index.html" if target == "home" else f"{target}.html"
        return f"[{text}]({href})"
    out = []
    blocks = [b.strip() for b in re.split(r"\n\s*\n", md.strip())]
    skip = False
    for k, b in enumerate(blocks):
        if skip: skip = False; continue
        sim = re.fullmatch(r"\[simulation:\s*([^\]]+)\]", b)
        if sim:
            name = sim.group(1).strip()
            if name not in SIMS: sys.exit(f"Unknown simulation: {name}")
            nxt = blocks[k+1] if k + 1 < len(blocks) else ""
            if name in INLINE_CAPTION and nxt.startswith("Caption:"):
                cap = powers(nxt[len("Caption:"):].strip()).replace('"', "&quot;")
                out.append('{%% include %s.html caption="%s" %%}' % (SIMS[name], cap)); skip = True; continue
            out.append("{%% include %s.html %%}" % SIMS[name]); continue
        cls = None
        for prefix, c in (("Lead:", "lede"), ("Caption:", "caption"), ("Links:", "links")):
            if b.startswith(prefix): b, cls = b[len(prefix):].strip(), c
        if cls == "links": b = b.replace(" | ", " ")
        b = re.sub(r"\[cite:\s*([^\]]+)\]", cite, b)
        b = re.sub(r"\[page:\s*([^\]]+)\]", pagelink, b)
        if not b.startswith("|"): b = powers(b)
        out.append(b + (f"\n{{: .{cls}}}" if cls else ""))
    return "\n\n".join(out) + "\n"

def front_matter(page, md):
    meta = dict(PAGES.get(page, {}))
    if not meta:  # course page
        title = re.search(r"^#\s+(.+)$", md, re.M).group(1).strip()
        meta = dict(file=f"{page}.md", title=title, nav="teaching", body_class="course")
    if re.search(r"\\?\[simulation:", md): meta["sims"] = True
    lines = ["---", "layout: default"] + [f"{k}: {json.dumps(v) if isinstance(v, str) else str(v).lower()}"
                                          for k, v in meta.items() if k != "file"] + ["---", ""]
    return meta["file"], "\n".join(lines)

if __name__ == "__main__":
    page, src = sys.argv[1], open(sys.argv[2], encoding="utf-8").read()
    if len(sys.argv) > 3: pubs = pubs_from_md(open(sys.argv[3], encoding="utf-8").read())
    elif page == "publications": pubs = pubs_from_md(src)
    else: pubs = pubs_from_yml("_data/publications.yml")
    fname, fm = front_matter(page, unescape(src))
    if page == "publications":
        write_yml(pubs, "_data/publications.yml")
        intro = [b for b in re.split(r"\n\s*\n", unescape(src).strip()) if b.startswith("#") or b.startswith("Lead:")]
        body = convert(page, "\n\n".join(intro), pubs) + "\n{% include publications-list.html %}\n"
    else:
        body = convert(page, src, pubs)
    open(fname, "w", encoding="utf-8").write(fm + body)
    print("wrote", fname)
