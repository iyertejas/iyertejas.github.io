/* Cross-reference previews for the lecture notes.
   Hovering (or, on a touch screen, tapping) a link to a numbered result or exercise shows its
   statement in a small window; the window has a link to go to it. Results on other pages are
   fetched once and cached. */
(() => {
"use strict";
const RESULT = /^(definition|lemma|theorem|corollary|remark|example|algorithm|proposition|exercise)-[\d-]+$/;
const touch = window.matchMedia && matchMedia("(hover: none)").matches;
const pages = new Map();                       // url -> Promise<Document>
let pop = null, owner = null, hideTimer = 0, showTimer = 0;

function target(a){
  const href = a.getAttribute("href") || "";
  const m = href.match(/^([^#]*)#(.+)$/);
  if (!m || !RESULT.test(m[2])) return null;
  const file = m[1], here = location.pathname.split("/").pop() || "index.html";
  return { file: file && file !== here ? file : "", id: m[2], href };
}
function load(file){
  if (!file) return Promise.resolve(document);
  if (!pages.has(file)) pages.set(file, fetch(file).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(t => new DOMParser().parseFromString(t, "text/html")));
  return pages.get(file);
}
// the labelled paragraph and what belongs to it: displays, parts (a), (b), lists, up to the proof or the next label
function statement(doc, id){
  const first = doc.getElementById(id);
  if (!first) return null;
  const out = [first.cloneNode(true)];
  // walk sibling nodes, not elements: on a fetched page the display maths is still a bare text node
  let node = first.nextSibling, kept = 0;
  while (node && kept < 8){
    if (node.nodeType === 3){
      if (node.textContent.trim()){ const d = document.createElement("div"); d.textContent = node.textContent.trim(); out.push(d); kept++; }
    } else if (node.nodeType === 1){
      const el = node, lead = el.firstElementChild, text = el.textContent.trim();
      if (/^H[1-6]$/.test(el.tagName) || el.tagName === "FIGURE" || el.tagName === "NAV" || el.classList.contains("caption")) break;
      if (el.tagName === "P" && lead && el.firstChild === lead && (lead.tagName === "STRONG" || (lead.tagName === "EM" && /^Proof/.test(lead.textContent)))) break;
      if (el.tagName === "P" && /^Proof/.test(text)) break;
      out.push(el.cloneNode(true)); kept++;
    }
    node = node.nextSibling;
  }
  out.forEach(n => { n.removeAttribute && n.removeAttribute("id"); n.querySelectorAll && n.querySelectorAll("[id]").forEach(x => x.removeAttribute("id")); });
  return out;
}
function place(a){
  const r = a.getBoundingClientRect(), w = Math.min(560, document.documentElement.clientWidth - 24);
  pop.style.width = w + "px";
  let x = r.left + window.scrollX;
  x = Math.max(window.scrollX + 12, Math.min(x, window.scrollX + document.documentElement.clientWidth - w - 12));
  const below = r.bottom + window.scrollY + 8, h = pop.offsetHeight;
  const roomBelow = window.innerHeight - r.bottom;
  pop.style.left = x + "px";
  pop.style.top = (roomBelow < h + 16 && r.top > h + 16 ? r.top + window.scrollY - h - 8 : below) + "px";
}
function label(id){                            // "algorithm-2-5" -> "Algorithm 2.5", "exercise-7" -> "Exercise 7"
  const [k, ...n] = id.split("-"); return k[0].toUpperCase() + k.slice(1) + " " + n.join(".");
}
function hide(){ clearTimeout(showTimer); if (pop){ pop.remove(); pop = null; } owner = null; }
function show(a, t){
  hide(); owner = a;
  pop = document.createElement("div");
  pop.className = "ref-pop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", a.textContent);
  pop.innerHTML = `<div class="ref-body"><p class="ref-wait">Loading…</p></div><p class="ref-go"><a href="${t.href}">Go to ${label(t.id)} →</a></p>`;
  pop.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  pop.addEventListener("mouseleave", () => { hideTimer = setTimeout(hide, 250); });
  document.body.appendChild(pop); place(a);
  const mine = pop;
  load(t.file).then(doc => {
    if (pop !== mine) return;
    const parts = statement(doc, t.id), body = pop.querySelector(".ref-body");
    if (!parts){ body.innerHTML = "<p>Not found on that page.</p>"; return; }
    body.innerHTML = ""; parts.forEach(n => body.appendChild(n));
    if (t.file && window.renderMathInElement)
      renderMathInElement(body, { delimiters:[{left:"\\[",right:"\\]",display:true},{left:"\\(",right:"\\)",display:false},{left:"$$",right:"$$",display:true}], throwOnError:false });
    place(a);
  }).catch(() => { if (pop === mine) pop.querySelector(".ref-body").innerHTML = "<p>Could not load the preview.</p>"; });
}
function init(){
  const main = document.querySelector("main"); if (!main) return;
  main.querySelectorAll("a[href*='#']").forEach(a => {
    const t = target(a); if (!t) return;
    a.classList.add("ref-link");
    if (touch){
      a.addEventListener("click", e => { if (owner === a) return; e.preventDefault(); show(a, t); });
    } else {
      a.addEventListener("mouseenter", () => { clearTimeout(hideTimer); clearTimeout(showTimer); showTimer = setTimeout(() => show(a, t), 220); });
      a.addEventListener("mouseleave", () => { clearTimeout(showTimer); hideTimer = setTimeout(hide, 250); });
      a.addEventListener("focus", () => show(a, t));
      a.addEventListener("blur", () => { hideTimer = setTimeout(hide, 250); });
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
  document.addEventListener("click", e => { if (pop && !pop.contains(e.target) && !(owner && owner.contains(e.target))) hide(); });
  window.addEventListener("resize", () => { if (pop && owner) place(owner); });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
