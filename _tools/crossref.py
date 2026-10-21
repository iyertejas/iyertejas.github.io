#!/usr/bin/env python3
"""Anchor and cross-link numbered results in the RL course notes.

Usage (from the repository root):  python3 _tools/crossref.py
Run it after adding or editing a lecture page or exercise sheet; it is idempotent.

1. Every paragraph that opens with a bold label such as "**Theorem 2.6 (UCB).**",
   "**Remark 2.7.**" or "**Exercise 2.4 (...)**" gets an id, e.g. theorem-2-6.
   Sheet 1 numbers its exercises 1, 2, ...; they become exercise-1, exercise-2, ...
2. Every reference in running text ("Lemma 1.6", "Theorem 2.4(b)", "Exercise 2.5",
   "Sheet 1, Exercise 8", "Section 4") becomes a link to that id, on the same page
   or on the page where the result lives. Maths, existing links and HTML are left alone.
3. Each "used later" tag on a sheet gets links to the places in the lecture notes
   that refer to the exercise (the nearest numbered result or section before each reference).
4. Each lecture page and sheet ends with previous/next links, the results page and the course page.
The results page (course-rl-2026-results.md) is written by hand: add new results there.
"""
import re, glob, os

COURSE = "course-rl-2026"
KINDS = "Definition|Lemma|Theorem|Corollary|Remark|Example|Algorithm|Proposition"

def lecture_page(k):  return f"{COURSE}-lecture-{k}"
def sheet_page(k):    return f"{COURSE}-sheet-{k}"

def page_of(name):
    m = re.match(rf"{COURSE}-(lecture|sheet)-(\d+)$", name)
    return (m.group(1), int(m.group(2))) if m else (None, None)

LABEL = re.compile(rf"^\*\*(?:(?P<kind>{KINDS}) (?P<a>\d+)\.(?P<b>\d+)|Exercise (?P<ea>\d+)(?:\.(?P<eb>\d+))?)\b")

def label_id(m):
    if m.group("kind"): return f"{m.group('kind').lower()}-{m.group('a')}-{m.group('b')}"
    return f"exercise-{m.group('ea')}" + (f"-{m.group('eb')}" if m.group("eb") else "")

def slug(heading):
    # kramdown's GFM ids: lower-case, drop punctuation, spaces to hyphens
    s = re.sub(r"[^\w\- ]", "", heading.strip().lower())
    return s.replace(" ", "-")

PROTECT = re.compile(r"<span class=\"used-in\">.*?</span>|<nav class=\"notes-nav\".*?</nav>|\$\$.*?\$\$|\[[^\]]*\]\([^)]*\)|<[^>]+>|\{%.*?%\}|\{:[^}]*\}", re.S)

def link_refs(text, here, sections):
    kind, num = page_of(here)
    def href(page, anchor):
        return f"#{anchor}" if page == here else f"{page}.html#{anchor}"
    def sub_plain(seg):
        # Sheet k, Exercise j  (Sheet 1 numbers exercises without a lecture prefix)
        seg = re.sub(r"Sheet (\d+), Exercise (\d+)(\([a-z]\))?",
                     lambda m: f"[{m.group(0)}]({href(sheet_page(int(m.group(1))), 'exercise-' + m.group(2))})", seg)
        # Theorem 2.4(b), Lemma 1.9(c), ...
        seg = re.sub(rf"(?<!\[)(?<!their )\b({KINDS}) (\d+)\.(\d+)(\([a-z]\))?",
                     lambda m: f"[{m.group(0)}]({href(lecture_page(int(m.group(2))), m.group(1).lower() + '-' + m.group(2) + '-' + m.group(3))})", seg)
        # Exercise 2.4(a)
        seg = re.sub(r"(?<!\[)(?<!, )\bExercise (\d+)\.(\d+)(\([a-z]\))?",
                     lambda m: f"[{m.group(0)}]({href(sheet_page(int(m.group(1))), 'exercise-' + m.group(1) + '-' + m.group(2))})", seg)
        # bare "Exercise 7" on Lecture 1 and Sheet 1 means Sheet 1
        if num == 1:
            seg = re.sub(r"(?<!\[)(?<!, )\bExercise (\d+)(?!\.\d|\d)(\([a-z]\))?",
                         lambda m: f"[{m.group(0)}]({href(sheet_page(1), 'exercise-' + m.group(1))})", seg)
        # Section 4 (same page)
        seg = re.sub(r"(?<!\[)\bSection (\d+)\b(?!\.\d)",
                     lambda m: f"[{m.group(0)}](#{sections[m.group(1)]})" if m.group(1) in sections else m.group(0), seg)
        return seg
    out, last = [], 0
    for m in PROTECT.finditer(text):
        out.append(sub_plain(text[last:m.start()])); out.append(m.group(0)); last = m.end()
    out.append(sub_plain(text[last:]))
    return "".join(out)

def process(path):
    here = os.path.basename(path)[:-3]
    src = open(path, encoding="utf-8").read()
    fm_end = src.index("\n---", 4) + 4
    front, body = src[:fm_end], src[fm_end:]
    sections = {}
    for h in re.findall(r"^## (\d+)\. (.+)$", body, re.M):
        sections[h[0]] = slug(f"{h[0]}. {h[1]}")
    blocks = body.split("\n\n")
    new = []
    for b in blocks:
        if b.lstrip().startswith(("#", "{%", "<", "$$\n", "{:")) or b.strip() == "":   # "$$\n" opens display maths
            new.append(b); continue
        m = LABEL.match(b.lstrip())
        if m:
            lab_end = b.index("**", 2) + 2           # keep the label itself unlinked
            head, rest = b[:lab_end], b[lab_end:]
            b = head + link_refs(rest, here, sections)
            ial = "{: #" + label_id(m) + "}"
            if not re.search(r"\n\{: #[^}]*\}\s*$", b):
                b = b.rstrip("\n") + "\n" + ial
        else:
            lines = b.split("\n")
            b = "\n".join(l if l.startswith("{:") else link_refs(l, here, sections) for l in lines)
        new.append(b)
    # names are not linked under "Reading": there they name chapters of a book
    reading = False; named = []
    for b in new:
        if b.lstrip().startswith("## "): reading = b.lstrip().startswith("## Reading")
        named.append(b if reading else link_names(b, here))
    new = named
    out = front + "\n\n".join(new)
    if out != src:
        open(path, "w", encoding="utf-8").write(out)
        print("updated", path)

# Names of algorithms, linked like numbered references: the first mention in each paragraph only,
# so that a paragraph about UCB is not covered in links. Add new algorithms here as they are introduced.
NAMED = [
    (r"(?<![\w-])UCB(?![\w-])", "lecture-2", "algorithm-2-5"),
    (r"(?<![\w-])ETC(?![\w-])", "lecture-2", "algorithm-2-3"),
    (r"(?<![\w-])[Ee]xplore-then-commit(?![\w-])", "lecture-2", "algorithm-2-3"),
]

def link_names(b, here):
    s = b.lstrip()
    if s.startswith(("#", "{%", "<", "$$\n", "{:", "```")) or not s: return b
    m = LABEL.match(s)
    head, rest = ("", b)
    if m:
        cut = b.index("**", b.index("**") + 2) + 2       # never link inside the bold label
        head, rest = b[:cut], b[cut:]
        if label_id(m) in [t for _, _, t in NAMED]:       # the algorithm's own paragraph
            return b
    for pat, page, anchor in NAMED:
        full = f"{COURSE}-{page}"
        if not os.path.exists(full + ".md"): continue
        href = f"#{anchor}" if full == here else f"{full}.html#{anchor}"
        if f"]({href})" in rest: continue                # this paragraph already links it
        done = False
        def first_only(seg):
            nonlocal done
            if done: return seg
            def r(mm):
                nonlocal done
                if done: return mm.group(0)
                done = True; return f"[{mm.group(0)}]({href})"
            return re.sub(pat, r, seg)
        out, last = [], 0
        for mm in PROTECT.finditer(rest):
            out.append(first_only(rest[last:mm.start()])); out.append(mm.group(0)); last = mm.end()
        out.append(first_only(rest[last:]))
        rest = "".join(out)
    return head + rest

NAME = {"definition":"Definition","lemma":"Lemma","theorem":"Theorem","corollary":"Corollary","remark":"Remark",
        "example":"Example","algorithm":"Algorithm","proposition":"Proposition"}

def where_used():
    """exercise anchor (page, id) -> list of (lecture page, nearest anchor id, its name)"""
    used = {}
    for path in sorted(glob.glob(f"{COURSE}-lecture-*.md")):
        here = os.path.basename(path)[:-3]; k = page_of(here)[1]
        body = open(path, encoding="utf-8").read()
        events = []
        for m in re.finditer(r"^\{: #([a-z]+)-(\d+)-(\d+)\}$", body, re.M):
            events.append((m.start(), "lab", m.group(1), f"{m.group(1)}-{m.group(2)}-{m.group(3)}", f"{NAME.get(m.group(1), m.group(1).title())} {m.group(2)}.{m.group(3)}"))
        for m in re.finditer(r"^## (\d+)\. (.+)$", body, re.M):
            events.append((m.start(), "sec", "", slug(f"{m.group(1)}. {m.group(2)}"), f"Lecture {k}, Section {m.group(1)}"))
        for m in re.finditer(r"\]\((course-rl-2026-sheet-\d+)\.html#(exercise-[\d-]+)\)", body):
            events.append((m.start(), "ref", m.group(1), m.group(2), ""))
        events.sort()
        # a labelled paragraph's IAL comes after its text, so for a reference use the next label if it closes the same block
        blocks = [(b.start(), b.end()) for b in re.finditer(r"(?:[^\n]+\n?)+", body)]
        def block_of(pos):
            for a, e in blocks:
                if a <= pos < e: return (a, e)
            return (pos, pos)
        # a paragraph that opens in bold without a number ("**Remark.**", "**Try it.**") ends the text that belongs to the result before it
        for a, e in blocks:
            if body[a:a+2] == "**" and not re.search(r"^\{: #", body[a:e], re.M):
                events.append((a, "cut", "", "", ""))
        events.sort()
        for pos, typ, x, y, nm in events:
            if typ != "ref": continue
            a, e = block_of(pos)
            own = [ev for ev in events if ev[1] == "lab" and a <= ev[0] <= e]
            before = [ev for ev in events if ev[1] in ("lab", "sec", "cut") and ev[0] < a]
            secs = [ev for ev in events if ev[1] == "sec" and ev[0] < a]
            if own: tgt = own[0]
            elif before and before[-1][1] == "lab": tgt = before[-1]        # in the statement, proof or text following a result
            else: tgt = secs[-1] if secs else None                         # otherwise name the section
            if tgt is None: continue
            lst = used.setdefault((x, y), [])
            if (here, tgt[3], tgt[4]) not in lst: lst.append((here, tgt[3], tgt[4]))
    return used

def tag_used_in(path, used):
    here = os.path.basename(path)[:-3]
    s = open(path, encoding="utf-8").read()
    s2 = re.sub(r' ?<span class="used-in">.*?</span>', "", s)
    def add(m):
        blk_id = m.group(2)
        places = used.get((here, blk_id), [])
        if not places: return m.group(0)
        links = "; ".join(f'<a href="{pg}.html#{aid}">{nm}</a>' for pg, aid, nm in places[:3])
        return m.group(1).replace('<span class="tag">used later</span>', f'<span class="tag">used later</span> <span class="used-in">in {links}</span>', 1) + m.group(3)
    s2 = re.sub(r'(\*\*Exercise[^\n]*?<span class="tag">used later</span>[^\n]*\n(?:[^\n]+\n)*?)(?=\{: #)(\{: #(exercise-[\d-]+)\})',
                lambda m: add_wrap(m, add), s2)
    if s2 != s:
        open(path, "w", encoding="utf-8").write(s2); print("tagged", path)

def add_wrap(m, add):
    class M:  # adapter: group(1) text, group(2) id, group(3) the IAL line
        def __init__(s, m): s.m = m
        def group(s, i): return {1: s.m.group(1), 2: s.m.group(3), 3: s.m.group(2)}[i]
    return add(M(m))

def nav(path):
    here = os.path.basename(path)[:-3]; kind, k = page_of(here)
    exists = lambda p: os.path.exists(p + ".md")
    items = []
    if kind == "lecture":
        if exists(lecture_page(k-1)): items.append(f'<a href="{lecture_page(k-1)}.html">← Lecture {k-1}</a>')
        if exists(sheet_page(k)): items.append(f'<a href="{sheet_page(k)}.html">Exercise Sheet {k}</a>')
        if exists(lecture_page(k+1)): items.append(f'<a href="{lecture_page(k+1)}.html">Lecture {k+1} →</a>')
    else:
        if exists(sheet_page(k-1)): items.append(f'<a href="{sheet_page(k-1)}.html">← Exercise Sheet {k-1}</a>')
        if exists(lecture_page(k)): items.append(f'<a href="{lecture_page(k)}.html">Lecture {k} notes</a>')
        if exists(sheet_page(k+1)): items.append(f'<a href="{sheet_page(k+1)}.html">Exercise Sheet {k+1} →</a>')
    if exists(f"{COURSE}-results"): items.append(f'<a href="{COURSE}-results.html">Results so far</a>')
    items.append(f'<a href="{COURSE}.html">Course page</a>')
    block = '<nav class="notes-nav" aria-label="Course notes">' + "".join(items) + "</nav>"
    s = open(path, encoding="utf-8").read()
    s2 = re.sub(r'\n*<nav class="notes-nav".*?</nav>\n*$', "", s, flags=re.S).rstrip("\n") + "\n\n" + block + "\n"
    if s2 != s:
        open(path, "w", encoding="utf-8").write(s2); print("nav", path)

if __name__ == "__main__":
    pages = sorted(glob.glob(f"{COURSE}-lecture-*.md") + glob.glob(f"{COURSE}-sheet-*.md"))
    for p in pages: process(p)
    used = where_used()
    for p in sorted(glob.glob(f"{COURSE}-sheet-*.md")): tag_used_in(p, used)
    for p in pages: nav(p)
