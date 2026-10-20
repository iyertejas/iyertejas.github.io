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

PROTECT = re.compile(r"\$\$.*?\$\$|\[[^\]]*\]\([^)]*\)|<[^>]+>|\{%.*?%\}|\{:[^}]*\}", re.S)

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
        seg = re.sub(r"(?<!\[)\bSection (\d+)\b",
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
        if b.lstrip().startswith(("#", "{%", "<", "$$", "{:")) or b.strip() == "":
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
    out = front + "\n\n".join(new)
    if out != src:
        open(path, "w", encoding="utf-8").write(out)
        print("updated", path)

if __name__ == "__main__":
    for p in sorted(glob.glob(f"{COURSE}-lecture-*.md") + glob.glob(f"{COURSE}-sheet-*.md")):
        process(p)
