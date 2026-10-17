/* Side panel: a fresh sample of a coagulation process on every visit. */
(() => {
"use strict";
const cv = document.getElementById("motif");
if (!cv) return;
const text = document.getElementById("motifText"), again = document.getElementById("motifAgain");
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

// Small seeded generator, so that a resize redraws the same sample.
function rng(seed){ let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// Marcus–Lushnikov coagulation with kernel min(x, y)^g, started from N unit masses,
// run until K clusters remain. Pairs are proposed uniformly and accepted with probability
// min(x, y)^g / B, where B = (second-largest mass)^g bounds the kernel over all pairs.
function sample(R){
  const N = 360, g = +(0.7 + R() * 0.9).toFixed(2), K = 36 + Math.floor(R() * 40);
  const m = Array(N).fill(1);
  while (m.length > K){
    let b1 = 0, b2 = 0;
    for (const x of m){ if (x > b1){ b2 = b1; b1 = x; } else if (x > b2) b2 = x; }
    const B = Math.pow(b2, g);
    for (;;){
      const i = Math.floor(R() * m.length);
      let j = Math.floor(R() * (m.length - 1)); if (j >= i) j++;
      if (R() * B <= Math.pow(Math.min(m[i], m[j]), g)){ m[i] += m[j]; m.splice(j, 1); break; }
    }
  }
  m.sort((a, b) => b - a);
  return {N, g, K, m};
}

let seed = Math.floor(Math.random() * 1e9), lastSize = "";

function draw(){
  const r = cv.getBoundingClientRect(), W = Math.round(r.width), H = Math.round(r.height);
  if (W < 10 || H < 10) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const R = rng(seed), s = sample(R);
  // Disc area proportional to mass; pack the largest first by rejection.
  let k = Math.sqrt(0.36 * W * H / (Math.PI * s.N));
  k = Math.min(k, 0.46 * Math.min(W, H) / Math.sqrt(s.m[0]));
  const placed = [];
  for (const x of s.m){
    const rad = k * Math.sqrt(x);
    for (let t = 0; t < 600; t++){
      const cx = rad + 2 + R() * (W - 2 * rad - 4), cy = rad + 2 + R() * (H - 2 * rad - 4);
      if (placed.every(q => (q[0] - cx) ** 2 + (q[1] - cy) ** 2 > (q[2] + rad + 3) ** 2)){ placed.push([cx, cy, rad]); break; }
    }
  }
  const accent = css("--accent"), soft = css("--soft"), line = css("--line");
  placed.forEach((q, i) => {
    ctx.beginPath(); ctx.arc(q[0], q[1], q[2], 0, 2 * Math.PI);
    if (i === 0){ ctx.fillStyle = accent; ctx.fill(); }
    else { ctx.fillStyle = soft; ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); }
  });
  text.innerHTML = `A coagulation process: ${s.N} particles in which clusters of masses x and y merge at rate min(x, y)<sup>${s.g}</sup>, stopped after ${s.N - s.K} merges. Disc area is proportional to mass; the largest cluster is highlighted.`;
}

again.addEventListener("click", () => { seed = Math.floor(Math.random() * 1e9); draw(); });
new ResizeObserver(() => { const r = cv.getBoundingClientRect(), key = Math.round(r.width) + "x" + Math.round(r.height); if (key !== lastSize){ lastSize = key; draw(); } }).observe(cv);
if (window.matchMedia){ const mq = matchMedia("(prefers-color-scheme: dark)"); mq.addEventListener && mq.addEventListener("change", draw); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();
