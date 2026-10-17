/* Side panel: a sample from one of the models in my research, chosen at random once per visit.
   The same picture stays while browsing (sessionStorage); "Draw another" picks a new model and sample. */
(() => {
"use strict";
const cv = document.getElementById("motif");
if (!cv) return;
const text = document.getElementById("motifText"), again = document.getElementById("motifAgain");
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const sup = x => `<sup>${x}</sup>`;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// Small seeded generator, so that a resize or a new page redraws the same sample.
function rng(seed){ let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function poisson(R, l){ const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= R(); } while (p > L); return k - 1; }

/* Coagulation: Marcus–Lushnikov process with kernel min(x, y)^g from N unit masses, run until K clusters
   remain. Pairs are proposed uniformly and accepted with probability min(x, y)^g / B, where
   B = (second-largest mass)^g bounds the kernel over all pairs. */
function coagulation(ctx, W, H, R, C){
  const N = 360, g = +(0.7 + R() * 0.9).toFixed(2), K = 36 + Math.floor(R() * 40), m = Array(N).fill(1);
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
  let k = Math.sqrt(0.36 * W * H / (Math.PI * N));
  k = Math.min(k, 0.46 * Math.min(W, H) / Math.sqrt(m[0]));
  const placed = [];
  for (const x of m){
    const r = k * Math.sqrt(x);
    for (let t = 0; t < 600; t++){
      const cx = r + 2 + R() * (W - 2 * r - 4), cy = r + 2 + R() * (H - 2 * r - 4);
      if (placed.every(q => (q[0] - cx) ** 2 + (q[1] - cy) ** 2 > (q[2] + r + 3) ** 2)){ placed.push([cx, cy, r]); break; }
    }
  }
  placed.forEach((q, i) => {
    ctx.beginPath(); ctx.arc(q[0], q[1], q[2], 0, 2 * Math.PI);
    if (i === 0){ ctx.fillStyle = C.accent; ctx.fill(); }
    else { ctx.fillStyle = C.soft; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke(); }
  });
  return `A coagulation process: ${N} particles in which clusters of masses x and y merge at rate min(x, y)${sup(g)}, stopped after ${N - K} merges. Disc area is proportional to mass; the largest cluster is highlighted.`;
}

/* Preferential attachment tree with weights (k+1)^a, drawn radially from the root. */
function paTree(ctx, W, H, R, C){
  const n = Math.round(clamp(W * H / 300, 160, 700)), a = +(0.6 + R() * 0.5).toFixed(2);
  const par = new Int32Array(n), deg = new Float64Array(n), w = new Float64Array(n);
  par[0] = -1; w[0] = 1; let tot = 1;
  for (let v = 1; v < n; v++){
    let u = R() * tot, p = 0;
    while (p < v - 1 && u > w[p]){ u -= w[p]; p++; }
    par[v] = p; deg[p]++; tot -= w[p]; w[p] = Math.pow(deg[p] + 1, a); tot += w[p]; w[v] = 1; tot += 1;
  }
  const ch = Array.from({length: n}, () => []); for (let v = 1; v < n; v++) ch[par[v]].push(v);
  const leaves = new Float64Array(n), dep = new Int32Array(n);
  for (let v = n - 1; v >= 0; v--) leaves[v] = ch[v].length ? ch[v].reduce((s, c) => s + leaves[c], 0) : 1;
  let md = 1; for (let v = 1; v < n; v++){ dep[v] = dep[par[v]] + 1; md = Math.max(md, dep[v]); }
  const ang = new Float64Array(n), lo = new Float64Array(n), hi = new Float64Array(n);
  lo[0] = R() * 2 * Math.PI; hi[0] = lo[0] + 2 * Math.PI;
  for (let v = 0; v < n; v++){
    let s = lo[v];
    for (const c of ch[v]){ const span = (hi[v] - lo[v]) * leaves[c] / leaves[v]; lo[c] = s; hi[c] = s + span; s += span; }
    ang[v] = (lo[v] + hi[v]) / 2;
  }
  const pad = 8, rx0 = W / 2 - pad, ry0 = H / 2 - pad, rx = Math.min(rx0, ry0 * 1.8), ry = Math.min(ry0, rx0 * 1.8);
  const X = v => W / 2 + Math.cos(ang[v]) * rx * dep[v] / md, Y = v => H / 2 + Math.sin(ang[v]) * ry * dep[v] / md;
  let hub = 0; for (let v = 0; v < n; v++) if (deg[v] > deg[hub]) hub = v;
  ctx.lineWidth = .8; ctx.strokeStyle = C.line; ctx.beginPath();
  for (let v = 1; v < n; v++){ if (par[v] === hub) continue; ctx.moveTo(X(par[v]), Y(par[v])); ctx.lineTo(X(v), Y(v)); }
  ctx.stroke();
  ctx.lineWidth = 1.4; ctx.strokeStyle = C.accent; ctx.beginPath();
  for (const c of ch[hub]){ ctx.moveTo(X(hub), Y(hub)); ctx.lineTo(X(c), Y(c)); }
  ctx.stroke();
  ctx.fillStyle = C.line; for (let v = 0; v < n; v++){ ctx.beginPath(); ctx.arc(X(v), Y(v), 1.3, 0, 2 * Math.PI); ctx.fill(); }
  ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(X(hub), Y(hub), 4, 0, 2 * Math.PI); ctx.fill();
  return `A random tree on ${n} vertices grown by preferential attachment with weights (k+1)${sup(a)}. Its largest hub, with ${deg[hub]} children, is highlighted.`;
}

/* Bienaymé–Galton–Watson tree with Poisson offspring, conditioned to reach (nearly) the last generation drawn.
   Generations run along the long side of the panel; lines of descent reaching the last generation are highlighted. */
function bgwTree(ctx, W, H, R, C){
  const horiz = W >= H, major = horiz ? W : H, minor = horiz ? H : W;
  const cap = Math.max(14, Math.round(minor / 6)), Gmax = clamp(Math.round(major / (horiz ? 70 : 60)), 6, 18);
  const lam = +(1.15 + R() * 0.25).toFixed(2);
  let gens;
  for (let tries = 0; tries < 3000; tries++){
    gens = [[-1]];
    for (let g = 1; g < Gmax; g++){
      const nx = [];
      gens[g - 1].forEach((_, i) => { const k = poisson(R, lam); for (let c = 0; c < k; c++) nx.push(i); });
      if (!nx.length || nx.length > cap) break;
      gens.push(nx);
    }
    if (gens.length >= Gmax - 1 && gens[gens.length - 1].length >= 3) break;
  }
  const G = gens.length;
  const pos = (g, i) => { const M = 8 + (major - 16) * (G === 1 ? 0 : g / (G - 1)), mm = minor * (i + .5) / gens[g].length; return horiz ? [M, mm] : [mm, M]; };
  const keep = gens.map(gn => new Uint8Array(gn.length)); keep[G - 1].fill(1);
  for (let g = G - 1; g > 0; g--) gens[g].forEach((p, i) => { if (keep[g][i]) keep[g - 1][p] = 1; });
  for (const hl of [0, 1]){
    ctx.strokeStyle = hl ? C.accent : C.line; ctx.lineWidth = hl ? 1.6 : .9; ctx.beginPath();
    for (let g = 1; g < G; g++) gens[g].forEach((p, i) => {
      if (!!keep[g][i] !== !!hl) return;
      const [x0, y0] = pos(g - 1, p), [x1, y1] = pos(g, i); ctx.moveTo(x0, y0);
      if (horiz){ const mx = (x0 + x1) / 2; ctx.bezierCurveTo(mx, y0, mx, y1, x1, y1); }
      else { const my = (y0 + y1) / 2; ctx.bezierCurveTo(x0, my, x1, my, x1, y1); }
    });
    ctx.stroke();
  }
  for (let g = 0; g < G; g++) gens[g].forEach((_, i) => {
    const [x, y] = pos(g, i); ctx.fillStyle = keep[g][i] ? C.accent : C.line;
    ctx.beginPath(); ctx.arc(x, y, keep[g][i] ? 2.2 : 1.6, 0, 2 * Math.PI); ctx.fill();
  });
  return `A Bienaymé–Galton–Watson tree with Poisson(${lam}) offspring, drawn for ${G} generations. Lines of descent that reach the last generation are highlighted.`;
}

/* Six urns with f(k) = (k+1)^a: each urn's share of the balls on a logarithmic time scale. */
function urns(ctx, W, H, R, C){
  const K = 6, a = +(0.6 + R() * 0.35).toFixed(2), T = 30000, P = Math.max(60, Math.round(Math.max(W, H) / 3));
  const cnt = new Float64Array(K), f = new Float64Array(K).fill(1), t0 = 150, times = [], shares = [];
  let tot = K, j = 0;
  for (let i = 0; i < P; i++) times.push(Math.round(Math.exp(Math.log(t0) + (Math.log(T) - Math.log(t0)) * i / (P - 1))));
  for (let t = 1; t <= T; t++){
    let u = R() * tot, i = 0;
    while (i < K - 1 && u > f[i]){ u -= f[i]; i++; }
    cnt[i]++; tot -= f[i]; f[i] = Math.pow(cnt[i] + 1, a); tot += f[i];
    while (j < P && times[j] === t){ shares.push(Array.from(cnt, c => c / t)); j++; }
  }
  let lead = 0; for (let i = 1; i < K; i++) if (cnt[i] > cnt[lead]) lead = i;
  const tall = H > W * 1.3, len = tall ? H : W, wid = tall ? W : H;
  let top = 0; shares.forEach(s => { top = Math.max(top, ...s); }); top = Math.min(1, top * 1.06);
  const u = i => 4 + (len - 8) * i / (P - 1), v = val => wid - 4 - (wid - 8) * Math.min(val, top) / top;
  const pt = (i, val) => tall ? [v(val), u(i)] : [u(i), v(val)];
  for (const k of [...Array(K).keys()].sort((x, y) => (x === lead) - (y === lead))){
    ctx.beginPath(); shares.forEach((s, i) => ctx.lineTo(...pt(i, s[k])));
    ctx.strokeStyle = k === lead ? C.accent : C.line; ctx.lineWidth = k === lead ? 2.2 : 1.1; ctx.lineJoin = "round"; ctx.stroke();
  }
  return `${K} urns where an urn with k balls gains the next ball with probability proportional to (k+1)${sup(a)}. Each line is one urn's share of the balls from step ${t0} to step ${T.toLocaleString("en-GB")}, on a logarithmic time scale; the urn that ends in front is highlighted.`;
}

const MODELS = [coagulation, paTree, bgwTree, urns];
const KEY = "motif-v1";
function fresh(){ return {kind: Math.floor(Math.random() * MODELS.length), seed: Math.floor(Math.random() * 1e9)}; }
function save(s){ try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
let state = null;
try { state = JSON.parse(sessionStorage.getItem(KEY)); } catch (e) {}
if (!state || !(state.kind >= 0 && state.kind < MODELS.length) || typeof state.seed !== "number"){ state = fresh(); save(state); }

let lastSize = "";
function draw(){
  const r = cv.getBoundingClientRect(), W = Math.round(r.width), H = Math.round(r.height);
  if (W < 10 || H < 10) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const C = {accent: css("--accent"), soft: css("--soft"), line: css("--line")};
  text.innerHTML = MODELS[state.kind](ctx, W, H, rng(state.seed), C);
}

again.addEventListener("click", () => {
  const prev = state.kind; state = fresh();
  if (state.kind === prev) state.kind = (prev + 1 + Math.floor(Math.random() * (MODELS.length - 1))) % MODELS.length;
  save(state); draw();
});
new ResizeObserver(() => { const r = cv.getBoundingClientRect(), key = Math.round(r.width) + "x" + Math.round(r.height); if (key !== lastSize){ lastSize = key; draw(); } }).observe(cv);
if (window.matchMedia){ const mq = matchMedia("(prefers-color-scheme: dark)"); mq.addEventListener && mq.addEventListener("change", draw); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();
