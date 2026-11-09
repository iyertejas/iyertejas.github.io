/* Hints on exercise sheets are hidden until the reader asks for them.
   A hint is written "*Hint:* ..." either as its own paragraph or inline as "(*Hint:* ...)".
   Each one is replaced by a "Show hint" button; the hint text after it is hidden until clicked.
   Runs after KaTeX has rendered the maths, so brackets inside formulas are not counted. */
(() => {
"use strict";
function setup(){
  document.querySelectorAll("main em").forEach(em => {
    if (!/^Hint[:.]?$/.test(em.textContent.trim())) return;
    const prev = em.previousSibling;
    const inline = prev && prev.nodeType === 3 && /\(\s*$/.test(prev.data);
    const body = [];
    let n = em.nextSibling, depth = 0, closed = false;
    while (n && !closed) {
      const next = n.nextSibling;
      if (inline && n.nodeType === 3) {
        for (let i = 0; i < n.data.length; i++) {
          const c = n.data[i];
          if (c === "(") depth++;
          else if (c === ")" && depth-- === 0) { n.splitText(i); closed = true; break; }
        }
      }
      body.push(n);
      n = closed ? null : next;
    }
    if (!body.length) return;
    const span = document.createElement("span");
    span.className = "hint-body";
    span.id = "hint-" + Math.random().toString(36).slice(2, 9);
    span.hidden = true;
    body.forEach(x => span.appendChild(x));
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hint-toggle";
    b.textContent = "Show hint";
    b.setAttribute("aria-expanded", "false");
    b.setAttribute("aria-controls", span.id);
    b.addEventListener("click", () => {
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(open));
      b.textContent = open ? "Hint:" : "Show hint";
      b.title = open ? "Hide hint" : "";
      span.hidden = !open;
    });
    em.replaceWith(b, span);
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
else setup();
})();
