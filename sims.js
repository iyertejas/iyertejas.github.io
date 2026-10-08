/* Simulations for research.html. Each widget starts when it scrolls into view. */
(() => {
"use strict";
const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = id => document.getElementById(id);
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const fmt = n => Math.round(n).toLocaleString("en-GB");
const palette = () => [0,1,2,3,4,5].map(i => css("--c"+i));
const expRV = r => -Math.log(1 - Math.random()) / r;

function setupCanvas(cv){
  const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  if (cv.width !== w*dpr || cv.height !== h*dpr){ cv.width = w*dpr; cv.height = h*dpr; }
  const ctx = cv.getContext("2d"); ctx.setTransform(dpr,0,0,dpr,0,0);
  return {ctx, w, h};
}
function hexToRgb(h){
  h = h.replace("#",""); if (h.length === 3) h = h.split("").map(c => c+c).join("");
  const n = parseInt(h,16); return [(n>>16)&255, (n>>8)&255, n&255];
}
function lerpColor(a, b, u){
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${A.map((v,i) => Math.round(v + (B[i]-v)*u)).join(",")})`;
}
function bindSlider(id, digits, onInput, onChange){
  const el = $(id), out = $(id+"Out");
  el.addEventListener("input", () => { out.textContent = (+el.value).toFixed(digits); onInput && onInput(+el.value); });
  el.addEventListener("change", () => onChange(+el.value));
  return () => +el.value;
}

class Fenwick{
  constructor(n){ this.n=n; this.t=new Float64Array(n+1); this.total=0; this.top=1; while(this.top*2<=n) this.top*=2; }
  add(i,d){ this.total+=d; for(i++; i<=this.n; i+=i&-i) this.t[i]+=d; }
  find(u){ let p=0; for(let b=this.top; b; b>>=1){ if(p+b<=this.n && this.t[p+b]<=u){ p+=b; u-=this.t[p]; } } return p; }
}

/* ---------- shared radial tree drawing ---------- */
function drawRadialTree(cv, parent, n, nodeColor, nodeR, highlight, pathTo){
  const {ctx,w,h} = setupCanvas(cv);
  ctx.clearRect(0,0,w,h);
  if (n < 1) return;
  const kids = Array.from({length:n}, () => []);
  const depth = new Int32Array(n), size = new Int32Array(n).fill(1);
  let maxD = 1;
  for (let i=1;i<n;i++){ kids[parent[i]].push(i); depth[i] = depth[parent[i]]+1; if (depth[i]>maxD) maxD = depth[i]; }
  for (let i=n-1;i>0;i--) size[parent[i]] += size[i];
  const a0 = new Float64Array(n), a1 = new Float64Array(n);
  a0[0] = 0; a1[0] = Math.PI*2;
  const x = new Float64Array(n), y = new Float64Array(n);
  const cx = w/2, cy = h/2, R = Math.min(w,h)/2 - 14;
  for (let i=0;i<n;i++){
    let s = a0[i]; const span = a1[i]-a0[i], tot = size[i]-1;
    for (const c of kids[i]){ const da = span*size[c]/Math.max(1,tot); a0[c]=s; a1[c]=s+da; s+=da; }
    const r = i===0 ? 0 : R*depth[i]/maxD, a = (a0[i]+a1[i])/2;
    x[i] = cx + r*Math.cos(a); y[i] = cy + r*Math.sin(a);
  }
  ctx.strokeStyle = css("--edge"); ctx.lineWidth = .7; ctx.globalAlpha = .75;
  ctx.beginPath();
  for (let i=1;i<n;i++){ ctx.moveTo(x[i],y[i]); ctx.lineTo(x[parent[i]],y[parent[i]]); }
  ctx.stroke(); ctx.globalAlpha = 1;
  if (pathTo !== undefined && pathTo > 0){
    ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.4; ctx.beginPath();
    for (let v = pathTo; v > 0; v = parent[v]){ ctx.moveTo(x[v],y[v]); ctx.lineTo(x[parent[v]],y[parent[v]]); }
    ctx.stroke();
  }
  for (let i=0;i<n;i++){
    ctx.fillStyle = nodeColor(i);
    ctx.beginPath(); ctx.arc(x[i],y[i],nodeR(i),0,Math.PI*2); ctx.fill();
  }
  if (highlight >= 0){
    ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x[highlight],y[highlight],nodeR(highlight)+3,0,Math.PI*2); ctx.stroke();
  }
}

/* =========================================================
   0b. Self-training loop. A model is a distribution p over K output types.
   Each generation it is retrained on N samples: a fraction λ fresh (uniform)
   and the rest drawn from p sharpened to p^(1/T).
   ========================================================= */
function selfWidget(){
  const K = 6, N = 2000, G = 80, STEP = 45;
  let hist = [], anim = 0, shown = 0;
  function nextGen(p, T, lam){
    const a = 1/T, sh = p.map(x => Math.pow(x, a)), z = sh.reduce((u,v)=>u+v,0);
    const r = sh.map(x => (1-lam)*x/z + lam/K), cum = []; let c = 0;
    for (const x of r){ c += x; cum.push(c); }
    const cnt = new Array(K).fill(0);
    for (let i=0;i<N;i++){ const u = Math.random()*c; let k = 0; while (k<K-1 && cum[k] < u) k++; cnt[k]++; }
    return cnt.map(x => x/N);
  }
  function run(T, lam){
    let p = nextGen(new Array(K).fill(1/K), 1, 1); const h = [p];
    for (let g=1; g<=G; g++){ p = nextGen(p, T, lam); h.push(p); }
    return h;
  }
  const eff = p => Math.exp(-p.reduce((s,x) => s + (x>0 ? x*Math.log(x) : 0), 0));
  function draw(){
    const {ctx,w,h} = setupCanvas($("selfPlot")); ctx.clearRect(0,0,w,h); if (!hist.length) return;
    const pL=44, pR=12, pT=8, pB=42, X = g => pL + g/G*(w-pL-pR), Y = y => pT + (1-y)*(h-pT-pB);
    const cols = palette(), m = Math.min(shown, G);
    for (let k=K-1;k>=0;k--){
      ctx.fillStyle = cols[k]; ctx.globalAlpha = .88; ctx.beginPath();
      for (let g=0; g<=m; g++){ let s=0; for (let j=0;j<=k;j++) s += hist[g][j]; g ? ctx.lineTo(X(g),Y(s)) : ctx.moveTo(X(g),Y(s)); }
      ctx.lineTo(X(m),Y(0)); ctx.lineTo(X(0),Y(0)); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.font = `12px ${css("--sans")}`; ctx.fillStyle = css("--muted"); ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1;
    for (let y=0;y<=1.0001;y+=.5){ ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(Math.round(y*100)+"%", pL-8, Y(y)); }
    ctx.textAlign="center"; ctx.textBaseline="top";
    for (let g=0; g<=G; g+=20) ctx.fillText(String(g), X(g), h-pB+8);
    ctx.fillText("generation", (X(0)+X(G))/2, h-pB+24);
  }
  function stat(){
    $("selfStatus").textContent = `After ${G} generations the model effectively produces ${eff(hist[G]).toFixed(1)} of the ${K} types.`;
  }
  function start(){
    cancelAnimationFrame(anim); hist = run(temp(), fresh()); $("selfStatus").textContent = "";
    if (reduced){ shown = G; draw(); stat(); return; }
    const t0 = performance.now();
    const tick = now => { shown = Math.min(G, Math.floor((now-t0)/STEP)); draw(); if (shown < G) anim = requestAnimationFrame(tick); else stat(); };
    anim = requestAnimationFrame(tick);
  }
  const temp = bindSlider("selfT", 2, null, start), fresh = bindSlider("selfL", 2, null, start);
  $("selfRun").addEventListener("click", start);
  return { start, redraw: draw };
}

/* =========================================================
   1a. Reinforced urns: leadership ribbon
   ========================================================= */
function urnWidget(){
  const L = { N:6, T:100000, G:900, start:10 };
  let st = null, anim = 0;
  function run(alpha){
    const {N,T,G,start} = L, f = new Float64Array(T+2);
    for (let k=0;k<f.length;k++) f[k] = Math.pow(k+1, alpha);
    const c = new Int32Array(N);
    let maxD=0, cnt=N, top=0, last=-1, changes=0, lastChange=0, step=0, g=0;
    const cps = new Float64Array(G), snap = new Int8Array(G);
    for (let i=0;i<G;i++) cps[i] = Math.round(start*Math.pow(T/start,(i+1)/G));
    return {
      snap, counts:c, get g(){return g;}, get changes(){return changes;}, get lastChange(){return lastChange;}, get step(){return step;},
      next(){
        if (g >= G) return false;
        while (step < cps[g]){
          step++;
          let tot=0; for (let i=0;i<N;i++) tot += f[c[i]];
          let u = Math.random()*tot, i=0;
          for (; i<N-1; i++){ u -= f[c[i]]; if (u<0) break; }
          const d = ++c[i];
          if (d>maxD){ maxD=d; cnt=1; top=i; } else if (d===maxD) cnt++;
          const s = cnt===1 ? top : -1;
          if (s>=0 && s!==last){ if (last>=0){ changes++; lastChange=step; } last=s; }
        }
        snap[g++] = cnt===1 ? top : -1; return true;
      }
    };
  }
  function draw(){
    const {ctx,w,h} = setupCanvas($("ribbon"));
    const pal = palette(), axisH = 22, bandH = h-axisH;
    ctx.clearRect(0,0,w,h);
    if (st) for (let x=0;x<w;x++){
      const gi = Math.min(L.G-1, Math.floor((x+.5)/w*L.G));
      if (gi >= st.g) break;
      ctx.fillStyle = st.snap[gi] < 0 ? css("--tie") : pal[st.snap[gi]];
      ctx.fillRect(x,0,1.02,bandH);
    }
    ctx.strokeStyle = css("--rule"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,bandH+.5); ctx.lineTo(w,bandH+.5); ctx.stroke();
    ctx.font = `12px ${css("--sans")}`; ctx.textBaseline = "top";
    const ticks = [10,100,1000,10000,100000], compact = ["10","10²","10³","10⁴","10⁵ steps"];
    ticks.forEach((t,i) => {
      const x = Math.log(t/L.start)/Math.log(L.T/L.start)*w, xc = Math.min(w-.5,Math.max(.5,x));
      ctx.beginPath(); ctx.moveTo(xc,bandH); ctx.lineTo(xc,bandH+5); ctx.stroke();
      ctx.textAlign = i===0 ? "left" : (i===ticks.length-1 ? "right" : "center");
      ctx.fillText(w<600 ? compact[i] : (t===100000 ? "100,000 steps" : fmt(t)), Math.min(w,Math.max(0,x)), bandH+7);
    });
  }
  function bars(){
    if (!st) return;
    const pal = palette(), c = st.counts, mx = Math.max(1,...c), tot = c.reduce((a,b)=>a+b,0)||1;
    const lead = st.g>0 ? st.snap[st.g-1] : -1;
    $("bars").innerHTML = Array.from(c, (v,i) =>
      `<span class="lab">${i===lead?`<b>Urn ${i+1}</b>`:`Urn ${i+1}`}</span><span class="track"><span class="fill" style="width:${(v/mx*100).toFixed(2)}%;background:${pal[i]}"></span></span><span class="num">${(v/tot*100).toFixed(1)}%</span>`
    ).join("");
    const who = lead<0 ? "tied at the top" : `urn ${lead+1} is ahead`;
    $("leadStatus").textContent = st.changes===0
      ? `Step ${fmt(st.step)}: ${who}. The lead has not changed hands.`
      : `Step ${fmt(st.step)}: ${who}. The lead has changed hands ${st.changes===1?"once":fmt(st.changes)+" times"}, most recently at step ${fmt(st.lastChange)}.`;
  }
  function verdict(a){
    $("leadVerdict").textContent =
      a > 1 ? `α = ${a.toFixed(2)} > 1: the sum converges, and so does ∑ 1/f(k). One urn eventually leads forever, and takes all but finitely many balls.`
    : a > .5 ? `α = ${a.toFixed(2)} is between ½ and 1: the sum converges, so one urn eventually leads forever, while every urn keeps growing.`
    : `α = ${a.toFixed(2)} ≤ ½: the sum diverges, so the lead changes hands infinitely often, and every ranking of the six urns recurs.`;
  }
  function start(){
    cancelAnimationFrame(anim);
    const a = alpha(); verdict(a); st = run(a);
    if (reduced){ while (st.next()); draw(); bars(); return; }
    const per = Math.ceil(L.G/170);
    const tick = () => { let more = true; for (let k=0;k<per&&more;k++) more = st.next(); draw(); bars(); if (more) anim = requestAnimationFrame(tick); };
    anim = requestAnimationFrame(tick);
  }
  const alpha = bindSlider("alpha", 2, verdict, start);
  $("leadRun").addEventListener("click", start);
  return { start, redraw(){ draw(); bars(); } };
}

/* =========================================================
   1b. Growing preferential-attachment tree
   ========================================================= */
function paWidget(){
  const N = 400;
  let anim = 0, s = null;
  function make(alpha){
    const parent = new Int32Array(N).fill(-1), kids = new Int32Array(N);
    const f = new Float64Array(N+1); for (let k=0;k<=N;k++) f[k] = Math.pow(k+1, alpha);
    const fw = new Fenwick(N); fw.add(0, f[0]);
    let n = 1, hub = 0, maxK = 0, cnt = 1, changes = 0, lastHub = 0;
    return {
      parent, kids, get n(){return n;}, get hub(){return cnt===1?hub:-1;}, get changes(){return changes;},
      grow(k){
        for (let r=0; r<k && n<N; r++){
          let v = fw.find(Math.random()*fw.total); if (v>=n) v = n-1;
          parent[n] = v; kids[v]++; fw.add(v, f[kids[v]]-f[kids[v]-1]); fw.add(n, f[0]); n++;
          if (kids[v] > maxK){ maxK = kids[v]; cnt = 1; hub = v; } else if (kids[v] === maxK) cnt++;
          if (cnt===1 && hub!==lastHub){ changes++; lastHub = hub; }
        }
        return n < N;
      }
    };
  }
  function draw(){
    if (!s) return;
    const acc = css("--accent"), node = css("--muted"), hub = s.hub;
    drawRadialTree($("paTree"), s.parent, s.n,
      i => i===hub ? acc : node,
      i => 1.4 + 1.1*Math.sqrt(s.kids[i]),
      hub);
    const deg = i => s.kids[i] + (i===0 ? 0 : 1);
    $("paStatus").textContent = hub < 0
      ? `${fmt(s.n)} vertices. Several vertices are tied for the largest degree.`
      : `${fmt(s.n)} vertices. The largest degree, ${deg(hub)}, belongs to vertex ${hub+1} (circled); the title has changed hands ${s.changes===1?"once":s.changes+" times"}.`;
  }
  function start(){
    cancelAnimationFrame(anim); s = make(alpha());
    if (reduced){ s.grow(N); draw(); return; }
    const tick = () => { const more = s.grow(3); draw(); if (more) anim = requestAnimationFrame(tick); };
    anim = requestAnimationFrame(tick);
  }
  const alpha = bindSlider("paAlpha", 2, null, start);
  $("paRun").addEventListener("click", start);
  return { start, redraw: draw };
}

/* =========================================================
   1c. Learners: reinforcement vs Thompson sampling
   ========================================================= */
function learnWidget(){
  // A learner choosing between options with success probabilities 0.6 and 0.4 picks each with probability
  // ∝ (its successes + 1)^α. Limits: α < 1 keeps sampling both; α = 1 settles on the better one;
  // α > 1 commits, with positive probability to the worse one.
  const B = { L:400, T:2000, late:500, pG:.6, pB:.4, Lc:240 };
  const AS = Array.from({length:16}, (_,i) => +(0.25 + i*0.1).toFixed(2));
  let sR = null, curve = null;
  function reinforced(alpha, L){
    const {T,late,pG,pB} = B, out = new Float64Array(L), f = new Float64Array(T+2);
    for (let k=0;k<f.length;k++) f[k] = Math.pow(k+1,alpha);
    for (let l=0;l<L;l++){ let a=0,b=0,lg=0;
      for (let t=0;t<T;t++){ if (Math.random()*(f[a]+f[b]) < f[a]){ if (Math.random()<pG) a++; if (t>=T-late) lg++; } else if (Math.random()<pB) b++; }
      out[l] = lg/late; }
    return out;
  }
  const shares = sh => { let g=0,b=0; for (const v of sh){ if (v>=.9) g++; else if (v<=.1) b++; } return [g/sh.length, b/sh.length]; };
  function mix(s){ return s<.5 ? lerpColor(css("--bad"),css("--mid"),s/.5) : lerpColor(css("--mid"),css("--good"),(s-.5)/.5); }
  function dots(id, sh){
    const {ctx,w,h} = setupCanvas($(id)); ctx.clearRect(0,0,w,h); if (!sh) return;
    const n=20, cell=Math.min(w,h)/n, r=cell*.36, sorted = Array.from(sh).sort((a,b)=>b-a);
    sorted.forEach((v,i) => { ctx.fillStyle = mix(v); ctx.beginPath(); ctx.arc((i%n+.5)*cell,(Math.floor(i/n)+.5)*cell,r,0,Math.PI*2); ctx.fill(); });
  }
  function tally(id, sh){
    const [g,b] = shares(sh), pc = x => Math.round(x*100)+"%";
    $(id).innerHTML = `<span style="--sw:var(--good)">Settled on the better option: ${pc(g)}</span><span style="--sw:var(--bad)">Settled on the worse option: ${pc(b)}</span><span style="--sw:var(--mid)">Still splitting their choices: ${pc(1-g-b)}</span>`;
  }
  function drawCurve(){
    const {ctx,w,h} = setupCanvas($("learnCurve")); ctx.clearRect(0,0,w,h); if (!curve) return;
    const pL=40, pR=12, pT=10, pB=40, a0=AS[0], a1=AS[AS.length-1];
    const X = a => pL + (a-a0)/(a1-a0)*(w-pL-pR), Y = y => pT + (1-y)*(h-pT-pB);
    const muted=css("--muted"), rule=css("--rule");
    ctx.font = `12px ${css("--sans")}`; ctx.lineWidth=1; ctx.strokeStyle=rule; ctx.fillStyle=muted;
    for (let y=0;y<=1.0001;y+=.25){ ctx.beginPath(); ctx.moveTo(pL,Math.round(Y(y))+.5); ctx.lineTo(w-pR,Math.round(Y(y))+.5); ctx.stroke();
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(Math.round(y*100)+"%", pL-6, Y(y)); }
    ctx.textAlign="center"; ctx.textBaseline="top";
    for (const a of [0.25,0.5,1,1.5,1.75]) ctx.fillText(String(a), X(a), h-pB+6);
    ctx.fillText("reinforcement strength α", (X(a0)+X(a1))/2, h-pB+22);
    ctx.setLineDash([4,4]); ctx.strokeStyle=muted; ctx.beginPath(); ctx.moveTo(X(1),Y(0)); ctx.lineTo(X(1),Y(1)); ctx.stroke(); ctx.setLineDash([]);
    const cur = alpha(); ctx.strokeStyle=css("--ink"); ctx.globalAlpha=.35; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(X(cur),Y(0)); ctx.lineTo(X(cur),Y(1)); ctx.stroke(); ctx.globalAlpha=1;
    for (const [k,col] of [[0,css("--good")],[1,css("--bad")]]){
      ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=2.2; ctx.beginPath();
      AS.forEach((a,i) => i ? ctx.lineTo(X(a),Y(curve[i][k])) : ctx.moveTo(X(a),Y(curve[i][k]))); ctx.stroke();
      AS.forEach((a,i) => { ctx.beginPath(); ctx.arc(X(a),Y(curve[i][k]),2.6,0,Math.PI*2); ctx.fill(); });
    }
  }
  let timer = 0;
  function start(full){
    clearTimeout(timer);
    timer = setTimeout(() => {
      sR = reinforced(alpha(), B.L); tally("tallyR", sR);
      if (full || !curve) curve = AS.map(a => shares(reinforced(a, B.Lc)));
      redraw();
    }, 30);
  }
  function redraw(){ dots("dotsR", sR); drawCurve(); $("learnGrad").style.background = `linear-gradient(90deg,${css("--bad")},${css("--mid")},${css("--good")})`; }
  const alpha = bindSlider("lAlpha", 2, drawCurve, () => start(false));
  $("learnRun").addEventListener("click", () => start(true));
  return { start: () => start(true), redraw };
}

/* =========================================================
   2a. Coagulation and gelation
   ========================================================= */
function gelWidget(){
  const C = { N:3000, tmax:8, dur:8000, AX:2, fill:.36 };
  const R0 = Math.sqrt(C.fill*C.AX/(C.N*Math.PI));   // radius of a unit-mass disc (box is AX × 1)
  let runs = [], sim = null, anim = 0, settle = 0;
  function make(gamma){
    const {N} = C, a = gamma/2, mass = new Float64Array(N).fill(1), w = new Float64Array(N).fill(1);
    const fw = new Fenwick(N); for (let i=0;i<N;i++) fw.add(i,1);
    let S=N, Q=N, t=0, alive=N, largest=1, big=0, nextT = expRV((S*S-Q)/(2*N));
    const pts = [[0,1/N]];
    // display positions: a jittered grid, one disc per particle
    const x = new Float64Array(N), y = new Float64Array(N), r = new Float64Array(N).fill(R0);
    const cols = Math.ceil(Math.sqrt(N*C.AX)), rows = Math.ceil(N/cols), sp = C.AX/cols, spy = 1/rows;
    const slots = Array.from({length:cols*rows}, (_,k) => k);
    for (let k=slots.length-1;k>0;k--){ const m = Math.floor(Math.random()*(k+1)); [slots[k],slots[m]] = [slots[m],slots[k]]; }
    for (let i=0;i<N;i++){ const s = slots[i], c = s%cols, rr = (s/cols)|0;
      x[i] = (c+.5)*sp + (Math.random()-.5)*(sp-2*R0)*.8; y[i] = (rr+.5)*spy + (Math.random()-.5)*(spy-2*R0)*.8; }
    const pick = () => { for(;;){ let i = fw.find(Math.random()*S); if (i>=N) i=N-1; if (w[i]>0) return i; } };
    return { gamma, pts, mass, x, y, r, get t(){return t;}, get big(){return big;},
      runUntil(T){
        while (alive>1 && nextT<=T){
          t = nextT; let i,j; do { i=pick(); j=pick(); } while (i===j);
          if (mass[j] > mass[i]) [i,j] = [j,i];            // the heavier cluster keeps its index
          // Pairs are proposed at rate (xy)^(γ/2)/N and accepted with probability (min/max)^(γ/2),
          // so mergers happen at rate min(x,y)^γ/N (thinning).
          if (Math.random() >= Math.pow(mass[j]/mass[i], a)){ const R = (S*S-Q)/(2*N); nextT = R>0 ? t+expRV(R) : Infinity; continue; }
          const m = mass[i]+mass[j];
          r[i] = R0*Math.sqrt(m); r[j] = 0;                // drawn where the heavier cluster was
          mass[i]=m; mass[j]=0;
          const nw = Math.pow(m,a);
          S += nw-w[i]-w[j]; Q += nw*nw-w[i]*w[i]-w[j]*w[j];
          fw.add(i,nw-w[i]); fw.add(j,-w[j]); w[i]=nw; w[j]=0; alive--;
          if (m>largest){ largest=m; big=i; pts.push([t,largest/N]); }
          const R = (S*S-Q)/(2*N); nextT = alive>1 && R>0 ? t+expRV(R) : Infinity;
        }
        if (T>t) t = Math.min(T,C.tmax);
      } };
  }
  // Push overlapping discs apart (display only); heavier discs move less.
  let head = new Int32Array(0), nxt = new Int32Array(C.N);
  function relax(iters){
    if (!sim) return;
    const {N,AX} = C, {x,y,r,mass} = sim, GI = .09;
    const ids = [], giants = [];
    let maxR = R0;
    for (let i=0;i<N;i++) if (mass[i]>0){ if (r[i]>GI) giants.push(i); else { ids.push(i); if (r[i]>maxR) maxR=r[i]; } }
    const cs = 2*maxR, gx = Math.ceil(AX/cs), gy = Math.ceil(1/cs);
    if (head.length < gx*gy) head = new Int32Array(gx*gy);
    const push = (i,j) => {
      const dx = x[j]-x[i], dy = y[j]-y[i], d2 = dx*dx+dy*dy, rr = r[i]+r[j];
      if (d2 >= rr*rr) return;
      const d = Math.sqrt(d2) || 1e-9, ov = (rr-d)*.5, ux = d2 ? dx/d : Math.random()-.5, uy = d2 ? dy/d : Math.random()-.5;
      const wi = mass[j]/(mass[i]+mass[j]), wj = 1-wi;
      x[i] -= ux*ov*wi; y[i] -= uy*ov*wi; x[j] += ux*ov*wj; y[j] += uy*ov*wj;
    };
    const wall = i => { const ri = Math.min(r[i], .5);
      x[i] = Math.min(AX-ri, Math.max(ri, x[i])); y[i] = Math.min(1-ri, Math.max(ri, y[i])); };
    for (let it=0; it<iters; it++){
      head.fill(-1, 0, gx*gy);
      for (const i of ids){ const c = Math.min(gx-1,Math.max(0,(x[i]/cs)|0)) + gx*Math.min(gy-1,Math.max(0,(y[i]/cs)|0)); nxt[i] = head[c]; head[c] = i; }
      for (const i of ids){
        const cx = Math.min(gx-1,Math.max(0,(x[i]/cs)|0)), cy = Math.min(gy-1,Math.max(0,(y[i]/cs)|0));
        for (let ox=-1; ox<=1; ox++) for (let oy=-1; oy<=1; oy++){
          const qx = cx+ox, qy = cy+oy; if (qx<0||qy<0||qx>=gx||qy>=gy) continue;
          for (let j = head[qx+gx*qy]; j>=0; j=nxt[j]) if (j>i) push(i,j);
        }
      }
      for (let a=0;a<giants.length;a++){ const g = giants[a];
        for (let b=a+1;b<giants.length;b++) push(g,giants[b]);
        for (const j of ids) push(g,j); }
      for (const i of ids) wall(i); for (const g of giants) wall(g);
    }
  }
  function field(){
    const cv = $("gelField"), {ctx,w,h} = setupCanvas(cv); ctx.clearRect(0,0,w,h); if (!sim) return;
    const sc = Math.min(w/C.AX, h), ox = (w-sc*C.AX)/2, oy = (h-sc)/2;
    const acc=css("--accent"), one=css("--edge"), many=css("--muted");
    const {x,y,r,mass} = sim, big = sim.big;
    ctx.fillStyle = one; ctx.beginPath();
    for (let i=0;i<C.N;i++) if (mass[i]===1){ ctx.moveTo(ox+x[i]*sc+r[i]*sc, oy+y[i]*sc); ctx.arc(ox+x[i]*sc, oy+y[i]*sc, Math.max(.6,r[i]*sc), 0, Math.PI*2); }
    ctx.fill();
    ctx.fillStyle = many; ctx.beginPath();
    for (let i=0;i<C.N;i++) if (mass[i]>1 && i!==big){ ctx.moveTo(ox+x[i]*sc+r[i]*sc, oy+y[i]*sc); ctx.arc(ox+x[i]*sc, oy+y[i]*sc, r[i]*sc, 0, Math.PI*2); }
    ctx.fill();
    if (mass[big]>1){ ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(ox+x[big]*sc, oy+y[big]*sc, r[big]*sc, 0, Math.PI*2); ctx.fill(); }
  }
  function chart(){
    const {ctx,w,h} = setupCanvas($("gelChart"));
    const muted=css("--muted"), rule=css("--rule"), acc=css("--accent");
    ctx.clearRect(0,0,w,h);
    const pL=44, pR=58, pT=10, pB=34, X = t => pL+t/C.tmax*(w-pL-pR), Y = y => pT+(1-y)*(h-pT-pB);
    ctx.font = `12px ${css("--sans")}`; ctx.fillStyle = muted; ctx.strokeStyle = rule; ctx.lineWidth = 1;
    for (let y=0;y<=1.0001;y+=.25){ ctx.beginPath(); ctx.moveTo(pL,Math.round(Y(y))+.5); ctx.lineTo(w-pR,Math.round(Y(y))+.5); ctx.stroke();
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(Math.round(y*100)+"%",pL-8,Y(y)); }
    ctx.textAlign="center"; ctx.textBaseline="top";
    for (let t=0;t<=C.tmax;t++) ctx.fillText(String(t),X(t),h-pB+8);
    ctx.textAlign="left"; ctx.fillText("time",X(C.tmax)+14,h-pB+8);
    const line = (r,tEnd,al,lw,col) => {
      ctx.globalAlpha=al; ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.lineJoin="round"; ctx.beginPath();
      let last=r.pts[0]; ctx.moveTo(X(0),Y(last[1]));
      for (const p of r.pts){ if (p[0]>tEnd) break; ctx.lineTo(X(p[0]),Y(last[1])); ctx.lineTo(X(p[0]),Y(p[1])); last=p; }
      ctx.lineTo(X(tEnd),Y(last[1])); ctx.stroke();
      ctx.globalAlpha=Math.min(1,al+.15); ctx.fillStyle=col; ctx.textAlign="left"; ctx.textBaseline="middle";
      ctx.fillText(`γ = ${r.gamma.toFixed(1)}`,X(tEnd)+6,Y(last[1])); ctx.globalAlpha=1;
    };
    runs.forEach(r => line(r,C.tmax,.32,1.5,muted));
    if (sim) line(sim,sim.t,1,2.4,acc);
  }
  function verdict(g){
    $("gelVerdict").textContent = g > 1
      ? `γ = ${g.toFixed(1)} > 1: large clusters merge fast enough for gelation in finite time. Expect a sudden jump in the largest cluster.`
      : `γ = ${g.toFixed(1)} ≤ 1: no gelation in finite time. The largest cluster grows, but only gradually.`;
  }
  function start(){
    cancelAnimationFrame(anim);
    if (sim){ sim.runUntil(C.tmax); runs.push(sim); if (runs.length>3) runs.shift(); }
    const g = gamma(); verdict(g); sim = make(g);
    if (reduced){ sim.runUntil(C.tmax); relax(60); chart(); field(); return; }
    const t0 = performance.now(); settle = 0;
    const tick = now => {
      const T = Math.min(C.tmax,(now-t0)/C.dur*C.tmax); sim.runUntil(T); relax(3); chart(); field();
      if (T<C.tmax || settle++ < 90) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  }
  const gamma = bindSlider("gamma", 1, verdict, start);
  $("gelRun").addEventListener("click", start);
  return { start, redraw(){ chart(); field(); } };
}

/* =========================================================
   2b. Condensation in a tree with fitness and neighbourhood influence
   (Fountoulakis–Iyer, EJP 2022, with h(x) = x, g(x,y) = x(1+y)).
   Vertex i joins with fitness W_i ~ density (b+1)(1-w)^b on [0,1]
   and receives each new vertex with probability ∝ W_i·(1 + Σ_children (1 + W_child)).
   ========================================================= */
function fitWidget(){
  const NT = 450, NS = 20000, BINS = 20;
  let tree = null, hist = null, theory = null, anim = 0;
  const drawW = b => 1 - Math.pow(Math.random(), 1/(b+1));
  // E[W/(1−W)] = 1/β, so the condensation criterion E[h(W)/(g̃* − g̃(W))] < 1 reads β(1 + 1/(β+2)) > 1, i.e. β > √3 − 1.
  const condenses = b => b*(1 + 1/(b+2)) > 1;
  const atomOf = b => 1 - 1/(b*(1 + 1/(b+2)));
  function grow(b, N){
    const W = new Float64Array(N), kids = new Int32Array(N), parent = new Int32Array(N).fill(-1);
    const fw = new Fenwick(N); W[0] = drawW(b); fw.add(0, W[0]);
    let n = 1;
    return { W, kids, parent, get n(){return n;},
      step(k){ for (let r=0;r<k&&n<N;r++){ let v = fw.find(Math.random()*fw.total); if (v>=n) v=n-1;
        parent[n]=v; kids[v]++; W[n]=drawW(b); fw.add(v,W[v]*(1+W[n])); fw.add(n,W[n]); n++; } return n<N; } };
  }
  // Limit: share of edges attached to vertices of fitness in each bin, plus an atom at w = 1.
  // With m = E[W] = 1/(b+2), edges by parent fitness have density x/(λ − (1+m)x) μ(dx), where
  // λ solves E[W/(λ − (1+m)W)] = 1 if possible; otherwise λ = 1+m and the deficit is the condensate.
  // Writing λ = (1+m)·L, this is E[W/(L − W)] = 1+m, and integ() below computes E[W/(L − W)].
  function limit(b){
    const p = Math.min(12, 2/b), M = 6000;
    const integ = (lam, lo, hi) => { // ∫ over u=1-w in [lo,hi] of (b+1) u^b (1-u)/(lam-1+u) du, via u = s^p
      const s0 = Math.pow(lo,1/p), s1 = Math.pow(hi,1/p); let acc = 0; const ds = (s1-s0)/M;
      for (let k=0;k<M;k++){ const s = s0+(k+.5)*ds, u = Math.pow(s,p), du = p*Math.pow(s,p-1)*ds;
        acc += (b+1)*Math.pow(u,b)*(1-u)/(lam-1+u)*du; }
      return acc; };
    const c = 1 + 1/(b+2);
    let lam = 1, atom = 0;
    if (!condenses(b)){ let lo = 1, hi = 60; for (let it=0;it<60;it++){ const m=(lo+hi)/2; if (integ(m,0,1)>c) lo=m; else hi=m; } lam = (lo+hi)/2; }
    else atom = atomOf(b);
    const bins = new Float64Array(BINS);
    for (let k=0;k<BINS;k++){ const wlo = k/BINS, whi = (k+1)/BINS; bins[k] = integ(lam, 1-whi, 1-wlo)/c; }
    return { bins, atom };
  }
  function simHist(b){
    const g = grow(b, NS); g.step(NS);
    const h = new Float64Array(BINS); let tot = 0;
    for (let i=0;i<NS;i++){ h[Math.min(BINS-1,Math.floor(g.W[i]*BINS))] += g.kids[i]; tot += g.kids[i]; }
    for (let k=0;k<BINS;k++) h[k] /= tot;
    return h;
  }
  function drawTree(){
    if (!tree) return;
    const lo = css("--fitlo"), hi = css("--fithi");
    let hub = 0; for (let i=1;i<tree.n;i++) if (tree.kids[i] > tree.kids[hub]) hub = i;
    drawRadialTree($("fitTree"), tree.parent, tree.n,
      i => lerpColor(lo, hi, Math.pow(tree.W[i], 1.5)),
      i => 1.4 + 1.1*Math.sqrt(tree.kids[i]), hub);
  }
  function drawChart(){
    const {ctx,w,h} = setupCanvas($("fitChart")); ctx.clearRect(0,0,w,h); if (!theory) return;
    const muted=css("--muted"), rule=css("--rule"), acc=css("--accent"), hi=css("--fithi");
    const pL=44, pR=64, pT=12, pB=34, plotW = w-pL-pR;
    const ymax = Math.max(.3, ...theory.bins, theory.atom, ...(hist||[]))*1.08;
    const X = x => pL + x*plotW, Y = y => pT + (1-y/ymax)*(h-pT-pB);
    ctx.font = `12px ${css("--sans")}`; ctx.strokeStyle=rule; ctx.fillStyle=muted; ctx.lineWidth=1;
    const step = ymax > .6 ? .2 : .1;
    for (let y=0;y<=ymax;y+=step){ ctx.beginPath(); ctx.moveTo(pL,Math.round(Y(y))+.5); ctx.lineTo(w-pR+30,Math.round(Y(y))+.5); ctx.stroke();
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(Math.round(y*100)+"%",pL-8,Y(y)); }
    ctx.textAlign="center"; ctx.textBaseline="top";
    for (let k=0;k<=4;k++) ctx.fillText((k/4).toString(), X(k/4), h-pB+8);
    ctx.textAlign="left"; ctx.fillText("fitness", X(1)+18, h-pB+8);
    const bw = plotW/BINS;
    for (let k=0;k<BINS;k++){ ctx.fillStyle = hi; ctx.globalAlpha=.85; ctx.fillRect(X(k/BINS)+1, Y(theory.bins[k]), bw-2, Y(0)-Y(theory.bins[k])); }
    ctx.globalAlpha = 1;
    if (theory.atom > 0){ // the condensate
      ctx.fillStyle = acc; ctx.fillRect(X(1)+4, Y(theory.atom), 8, Y(0)-Y(theory.atom));
      ctx.textAlign="left"; ctx.textBaseline="bottom"; ctx.fillStyle = acc;
      ctx.fillText(`${Math.round(theory.atom*100)}% at 1`, Math.min(X(1)+2, w-64), Y(theory.atom)-4);
    }
    if (hist){ ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.6;
      for (let k=0;k<BINS;k++){ const y = Y(hist[k]); ctx.beginPath(); ctx.moveTo(X(k/BINS)+2,y); ctx.lineTo(X((k+1)/BINS)-2,y); ctx.stroke(); } }
  }
  function verdict(b){
    $("fitVerdict").textContent = condenses(b)
      ? `β = ${b.toFixed(2)} > √3 − 1 ≈ 0.73: condensation. In the limit, ${Math.round(atomOf(b)*100)}% of all edges escape to vertices of maximal fitness.`
      : `β = ${b.toFixed(2)} ≤ √3 − 1 ≈ 0.73: no condensation. Edges spread over fitness values, with no mass escaping to the top.`;
  }
  function start(){
    cancelAnimationFrame(anim);
    const b = beta(); verdict(b);
    theory = limit(b); hist = simHist(b); drawChart();
    tree = grow(b, NT);
    if (reduced){ tree.step(NT); drawTree(); return; }
    const tick = () => { const more = tree.step(3); drawTree(); if (more) anim = requestAnimationFrame(tick); };
    anim = requestAnimationFrame(tick);
  }
  const beta = bindSlider("fitBeta", 2, verdict, start);
  $("fitRun").addEventListener("click", start);
  return { start, redraw(){ drawTree(); drawChart(); } };
}

/* =========================================================
   3. Weighted random recursive tree as a CMJ process: growth and explosion
   Each individual has children at constant rate W, its Pareto(a) weight (Iyer, ECP 2024).
   ========================================================= */
function cmjWidget(){
  const CAP = 100000, M = 220;
  let res = null, anim = 0, shown = 0, shownPlot = 1;
  function run(a){
    // Weighted random recursive tree: vertex i has weight W_i = U^(-1/a), so P(W > x) = x^(-a) for x ≥ 1,
    // and each newcomer attaches to i with probability ∝ W_i. In continuous time every individual has
    // children at constant rate W_i (a CMJ process), so the gap before the next birth is Exp(sum of weights).
    const W = new Float64Array(CAP), parent = new Int32Array(M).fill(-1), birth = new Float64Array(CAP);
    const fw = new Fenwick(CAP);
    W[0] = Math.pow(1-Math.random(), -1/a); fw.add(0, W[0]); let t = 0;
    for (let n=1;n<CAP;n++){
      t += expRV(fw.total); let v = fw.find(Math.random()*fw.total); if (v>=n) v = n-1;
      if (n < M) parent[n] = v; birth[n] = t;
      W[n] = Math.pow(1-Math.random(), -1/a); fw.add(n, W[n]);
    }
    return { birth, parent, a };
  }
  function drawTree(){
    const {ctx,w,h} = setupCanvas($("cmjTree")); ctx.clearRect(0,0,w,h); if (!res) return;
    const {birth, parent} = res, m = Math.min(M, shown);
    const tEnd = birth[M-1]*1.04 || 1;
    const ch = Array.from({length:M}, () => []); for (let i=1;i<M;i++) ch[parent[i]].push(i);
    const row = new Int32Array(M); let r = 0;
    const stack = [0]; while (stack.length){ const v = stack.pop(); row[v] = r++; for (let j=ch[v].length-1;j>=0;j--) stack.push(ch[v][j]); }
    const pL=8, pR=10, pT=8, pB=26, X = t => pL + t/tEnd*(w-pL-pR), Yr = k => pT + (k+.5)/M*(h-pT-pB);
    ctx.lineWidth = 1; ctx.strokeStyle = css("--edge");
    for (let i=0;i<m;i++){ const y = Yr(row[i]);
      ctx.beginPath(); ctx.moveTo(X(birth[i]),y); ctx.lineTo(X(tEnd),y);
      if (i>0){ ctx.moveTo(X(birth[i]),y); ctx.lineTo(X(birth[i]),Yr(row[parent[i]])); } ctx.stroke(); }
    ctx.fillStyle = css("--accent");
    for (let i=0;i<m;i++){ ctx.beginPath(); ctx.arc(X(birth[i]),Yr(row[i]),1.6,0,Math.PI*2); ctx.fill(); }
    ctx.fillStyle = css("--muted"); ctx.font = `12px ${css("--sans")}`; ctx.textBaseline="top";
    ctx.textAlign="left"; ctx.fillText("0", pL, h-pB+8);
    ctx.textAlign="right"; ctx.fillText(`time ${tEnd.toFixed(2)}`, w-pR, h-pB+8);
  }
  function drawPlot(){
    const {ctx,w,h} = setupCanvas($("cmjPlot")); ctx.clearRect(0,0,w,h); if (!res) return;
    const {birth} = res, upto = shownPlot;
    const tEnd = birth[CAP-1]*1.04;
    const pL=44, pR=10, pT=10, pB=26, X = t => pL + t/tEnd*(w-pL-pR), Y = l => pT + (1-l/5)*(h-pT-pB);
    ctx.font = `12px ${css("--sans")}`; ctx.strokeStyle=css("--rule"); ctx.fillStyle=css("--muted"); ctx.lineWidth=1;
    for (let l=0;l<=5;l++){ ctx.beginPath(); ctx.moveTo(pL,Math.round(Y(l))+.5); ctx.lineTo(w-pR,Math.round(Y(l))+.5); ctx.stroke();
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(l===0?"1":"10"+"⁰¹²³⁴⁵"[l], pL-8, Y(l)); }
    ctx.textBaseline="top"; ctx.textAlign="left"; ctx.fillText("0", pL, h-pB+8);
    ctx.textAlign="right"; ctx.fillText(`time ${tEnd.toFixed(2)}`, w-pR, h-pB+8);
    ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.2; ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    for (let i=1;i<upto;i=Math.max(i+1, Math.floor(i*1.02))) ctx.lineTo(X(birth[i]), Y(Math.log10(i+1)));
    ctx.lineTo(X(birth[upto-1]), Y(Math.log10(upto)));
    ctx.stroke();
  }
  function verdict(a){
    $("cmjVerdict").textContent = a < 1
      ? `a = ${a.toFixed(2)} < 1: the weights have infinite mean and a heavy enough tail for explosion: infinitely many births in finite time.`
      : a > 1
      ? `a = ${a.toFixed(2)} > 1: the weights have finite mean ${(a/(a-1)).toFixed(2)}, so there is no explosion. The population grows exponentially, at that rate.`
      : `a = 1: the borderline case. The weights have infinite mean, but the tail is too light for the explosion criterion.`;
  }
  function start(){
    cancelAnimationFrame(anim);
    const a = tail(); verdict(a); res = run(a);
    const dur = 2600, t0 = performance.now();
    const set = u => { shown = Math.ceil(u*M); shownPlot = Math.max(2, Math.round(Math.pow(CAP, u))); };
    if (reduced){ set(1); drawTree(); drawPlot(); stat(); return; }
    const tick = now => { const u = Math.min(1,(now-t0)/dur); set(u); drawTree(); drawPlot(); if (u<1) anim = requestAnimationFrame(tick); else stat(); };
    anim = requestAnimationFrame(tick);
  }
  function stat(){
    const b = res.birth, t3 = b[999], t5 = b[CAP-1];
    $("cmjStatus").textContent = `The 1,000th birth came at time ${t3.toFixed(2)} and the 100,000th at time ${t5.toFixed(2)}: ${((t5-t3)/t5*100).toFixed(0)}% of the elapsed time for the last 99% of the population.`;
  }
  const tail = bindSlider("cmjA", 2, verdict, start);
  $("cmjRun").addEventListener("click", start);
  return { start, redraw(){ drawTree(); drawPlot(); } };
}


/* =========================================================
   4. Two-armed Bernoulli bandit: regret of several algorithms
   ========================================================= */
function banditWidget(){
  const T = 5000, G = 120, RUNS = 100, BUDGET = 22;
  const ALGS = [
    {id:"greedy", name:"Greedy", c:"--c5"},
    {id:"eps",    name:"ε-greedy (ε = 0.1)", c:"--c1"},
    {id:"ucb",    name:"UCB", c:"--c3"},
    {id:"klucb",  name:"KL-UCB", c:"--c2"},
    {id:"ts",     name:"Thompson sampling", c:"--c0"}
  ];
  const shown = new Set(ALGS.map(a => a.id));
  const cps = []; for (let g=0; g<G; g++){ const v = Math.round(Math.pow(T, g/(G-1))); if (!cps.length || v > cps[cps.length-1]) cps.push(v); }
  const kl = (p,q) => { const e=1e-12; p=Math.min(Math.max(p,e),1-e); q=Math.min(Math.max(q,e),1-e); return p*Math.log(p/q)+(1-p)*Math.log((1-p)/(1-q)); };
  function klIndex(mu, n, t){ const lvl = Math.log(t)/n; let lo = mu, hi = 1; for (let i=0;i<16;i++){ const m=(lo+hi)/2; if (kl(mu,m) > lvl) hi = m; else lo = m; } return lo; }
  function gammaV(k){
    if (k<1) return gammaV(k+1)*Math.pow(Math.random(),1/k);
    const d=k-1/3, c=1/Math.sqrt(9*d);
    for(;;){ let x,v; do{ const u1=1-Math.random(),u2=Math.random(); x=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2); v=1+c*x; }while(v<=0);
      v=v*v*v; const u=Math.random(); if (u<1-.0331*x*x*x*x) return d*v; if (Math.log(u)<.5*x*x+d*(1-v+Math.log(v))) return d*v; }
  }
  const betaV = (a,b) => { const x=gammaV(a), y=gammaV(b); return x/(x+y); };
  function oneRun(alg, mu, acc, worse){
    const n=[0,0], s=[0,0], best=Math.max(mu[0],mu[1]), bad = mu[0]<mu[1] ? 0 : 1;
    let reg=0, gi=0;
    for (let t=1; t<=T; t++){
      let a;
      if (alg!=="ts" && t<=2) a = t-1;
      else if (alg==="greedy") a = s[1]/n[1] > s[0]/n[0] ? 1 : 0;
      else if (alg==="eps") a = Math.random()<0.1 ? (Math.random()<.5?0:1) : (s[1]/n[1] > s[0]/n[0] ? 1 : 0);
      else if (alg==="ucb"){ const b = k => s[k]/n[k] + Math.sqrt(2*Math.log(t)/n[k]); a = b(1) > b(0) ? 1 : 0; }
      else if (alg==="klucb") a = klIndex(s[1]/n[1],n[1],t) > klIndex(s[0]/n[0],n[0],t) ? 1 : 0;
      else a = betaV(s[1]+1,n[1]-s[1]+1) > betaV(s[0]+1,n[0]-s[0]+1) ? 1 : 0;
      if (Math.random() < mu[a]) s[a]++;
      n[a]++; reg += best - mu[a];
      while (gi < cps.length && cps[gi] === t){ acc[gi] += reg; gi++; }
    }
    worse.v += n[bad]/T;
  }
  let st = null, timer = 0;
  function start(){
    cancelAnimationFrame(timer);
    const d = gap(), mu = [0.5 + d/2, 0.5 - d/2];
    if (Math.random() < .5) mu.reverse();               // the better arm is not always arm 1
    st = { mu, d, runs:0, acc: Object.fromEntries(ALGS.map(a => [a.id, new Float64Array(cps.length)])),
           worse: Object.fromEntries(ALGS.map(a => [a.id, {v:0}])) };
    const step = () => {
      const t0 = performance.now();
      while (st.runs < RUNS && performance.now() - t0 < BUDGET){
        for (const a of ALGS) oneRun(a.id, st.mu, st.acc[a.id], st.worse[a.id]);
        st.runs++;
        if (reduced) continue;
      }
      draw(); status();
      if (st.runs < RUNS) timer = requestAnimationFrame(step);
    };
    if (reduced){ while (st.runs < RUNS){ for (const a of ALGS) oneRun(a.id, st.mu, st.acc[a.id], st.worse[a.id]); st.runs++; } draw(); status(); return; }
    timer = requestAnimationFrame(step);
  }
  const lr = t => st.d / kl(Math.min(...st.mu), Math.max(...st.mu)) * Math.log(t);
  function draw(){
    const {ctx,w,h} = setupCanvas($("banditChart")); ctx.clearRect(0,0,w,h); if (!st || !st.runs) return;
    const muted=css("--muted"), rule=css("--rule"), sans=css("--sans");
    const pL=46, pR = w < 600 ? 14 : 150, pT=12, pB=34;
    const X = t => pL + Math.log(t)/Math.log(T)*(w-pL-pR);
    const mean = id => i => st.acc[id][i]/st.runs;
    const last = cps.length-1;
    const scaleIds = [...shown].filter(id => id !== "greedy" || shown.size === 1);
    let ymax = Math.max(lr(T), ...scaleIds.map(id => mean(id)(last))) * 1.15;
    const nice = [5,10,20,25,50,100,200,250,500,1000]; const step = nice.find(s => ymax/s <= 6) || 1000;
    ymax = Math.ceil(ymax/step)*step;
    const Y = y => pT + (1 - y/ymax)*(h-pT-pB);
    ctx.font = `12px ${sans}`; ctx.lineWidth = 1; ctx.strokeStyle = rule; ctx.fillStyle = muted;
    for (let y=0; y<=ymax+1e-9; y+=step){ ctx.beginPath(); ctx.moveTo(pL,Math.round(Y(y))+.5); ctx.lineTo(w-pR,Math.round(Y(y))+.5); ctx.stroke();
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(String(y), pL-8, Y(y)); }
    ctx.textBaseline="top"; ctx.textAlign="center";
    const xt = w < 600 ? [1,10,100,1000] : [1,10,100,1000,5000];
    for (const t of xt) ctx.fillText(t.toLocaleString("en-GB"), X(t), h-pB+8);
    ctx.textAlign="right"; ctx.fillText(w < 600 ? "round" : "round (log scale)", w-pR, h-pB+22 > h-12 ? h-pB+8 : h-pB+22);
    ctx.save(); ctx.translate(12, pT+(h-pT-pB)/2); ctx.rotate(-Math.PI/2); ctx.textAlign="center"; ctx.textBaseline="top"; ctx.fillText("average regret", 0, 0); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(pL, pT-2, w-pL-pR+2, h-pT-pB+4); ctx.clip();
    // Lai–Robbins rate
    ctx.setLineDash([5,5]); ctx.strokeStyle = css("--ink"); ctx.globalAlpha=.55; ctx.lineWidth=1.4; ctx.beginPath();
    cps.forEach((t,i) => i ? ctx.lineTo(X(t),Y(lr(t))) : ctx.moveTo(X(t),Y(lr(t)))); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1;
    for (const a of ALGS){ if (!shown.has(a.id)) continue; const m = mean(a.id);
      ctx.strokeStyle = css(a.c); ctx.lineWidth = 2.2; ctx.lineJoin="round"; ctx.beginPath();
      cps.forEach((t,i) => i ? ctx.lineTo(X(t),Y(m(i))) : ctx.moveTo(X(t),Y(m(i)))); ctx.stroke(); }
    ctx.restore();
    if (w >= 600){ // end labels, nudged apart
      const labs = [{y:Y(lr(T)), txt:"Lai–Robbins rate", c:css("--ink"), a:.7}];
      for (const a of ALGS){ if (!shown.has(a.id)) continue; const v = mean(a.id)(last);
        labs.push({y: v > ymax ? pT+6 : Y(v), txt: a.name.replace(" (ε = 0.1)","") + (v > ymax ? ` ↑ ${Math.round(v)}` : ""), c:css(a.c), a:1}); }
      labs.sort((p,q) => p.y - q.y);
      for (let i=1;i<labs.length;i++) if (labs[i].y - labs[i-1].y < 15) labs[i].y = labs[i-1].y + 15;
      ctx.textAlign="left"; ctx.textBaseline="middle"; ctx.font = `12px ${sans}`;
      for (const l of labs){ ctx.globalAlpha = l.a; ctx.fillStyle = l.c; ctx.fillText(l.txt, w-pR+8, l.y); } ctx.globalAlpha = 1;
    }
  }
  function status(){
    if (!st) return;
    const last = cps.length-1, ids = ALGS.filter(a => shown.has(a.id));
    const better = st.mu[0] > st.mu[1] ? 1 : 2;
    const parts = ids.map(a => `${a.name.replace(" (ε = 0.1)","")} ${Math.round(st.acc[a.id][last]/st.runs)}`);
    $("banditStatus").textContent = `Arm ${better} is better (success probabilities ${Math.max(...st.mu).toFixed(3).replace(/0+$/,"").replace(/\.$/,"")} and ${Math.min(...st.mu).toFixed(3).replace(/0+$/,"").replace(/\.$/,"")}). `
      + `Averaged over ${st.runs} of ${RUNS} runs, regret after 5,000 rounds: ${parts.join(", ")}; Lai–Robbins rate ${Math.round(lr(T))}.`;
  }
  $("algs").innerHTML = ALGS.map(a => `<button type="button" aria-pressed="true" data-id="${a.id}" style="--sw:var(${a.c})">${a.name}</button>`).join("");
  $("algs").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.id;
    if (shown.has(id) && shown.size > 1) shown.delete(id); else shown.add(id);
    b.setAttribute("aria-pressed", shown.has(id) ? "true" : "false");
    draw(); status();
  }));
  const gap = bindSlider("gap", 2, null, start);
  $("banditRun").addEventListener("click", start);
  return { start, redraw(){ draw(); } };
}


/* =========================================================
   0. Phases of matter: 2D Lennard-Jones particles under gravity,
      held at a temperature by a Langevin thermostat
   ========================================================= */
function phaseWidget(){
  const N = 70, W = 22, H = 22, g = 0.15, dt = 0.005, gam = 1.0, rc2 = 6.25, STEPS = 18;
  const x = new Float64Array(N), y = new Float64Array(N), vx = new Float64Array(N), vy = new Float64Array(N);
  const fx = new Float64Array(N), fy = new Float64Array(N), nb = new Int32Array(N);
  let T = 0.25, anim = 0, running = false, frame = 0, ord = 0.6, vap = 0;
  function reset(){
    const a = 1.12, per = Math.floor((W - 2.8) / a) + 1;
    for (let i = 0; i < N; i++){ const r = Math.floor(i / per), c = i % per;
      x[i] = 1.15 + c*a + (r % 2)*a/2; y[i] = 1.1 + r*a*0.866; vx[i] = vy[i] = 0; }
    forces();
  }
  const wf = d => { d = Math.max(d, 0.5); return d < 1.12 ? 24*(2/Math.pow(d,13) - 1/Math.pow(d,7)) : 0; };
  function forces(){
    fx.fill(0); fy.fill(0);
    for (let i = 0; i < N; i++){
      fy[i] -= g;
      for (let j = i + 1; j < N; j++){
        const dx = x[i]-x[j], dy = y[i]-y[j]; let r2 = dx*dx + dy*dy;
        if (r2 < rc2){ if (r2 < 0.64) r2 = 0.64; const ir2 = 1/r2, ir6 = ir2*ir2*ir2, f = 24*ir2*ir6*(2*ir6 - 1);
          fx[i] += f*dx; fy[i] += f*dy; fx[j] -= f*dx; fy[j] -= f*dy; }
      }
      fx[i] += wf(x[i]) - wf(W - x[i]); fy[i] += wf(y[i]) - wf(H - y[i]);
    }
  }
  const gauss = () => { const u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
  function step(){
    const c1 = Math.exp(-gam*dt), c2 = Math.sqrt((1 - c1*c1)*T);
    for (let i = 0; i < N; i++){ vx[i] += .5*dt*fx[i]; vy[i] += .5*dt*fy[i]; x[i] += dt*vx[i]; y[i] += dt*vy[i]; }
    forces();
    for (let i = 0; i < N; i++){ vx[i] += .5*dt*fx[i]; vy[i] += .5*dt*fy[i];
      vx[i] = c1*vx[i] + c2*gauss(); vy[i] = c1*vy[i] + c2*gauss(); }
  }
  function neighbours(){
    nb.fill(0);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++){
      const dx = x[i]-x[j], dy = y[i]-y[j]; if (dx*dx + dy*dy < 2.25){ nb[i]++; nb[j]++; } }
    let o = 0, v = 0; for (let i = 0; i < N; i++){ if (nb[i] >= 6) o++; if (nb[i] <= 1) v++; }
    ord = .9*ord + .1*o/N; vap = .9*vap + .1*v/N;
  }
  function draw(){
    const {ctx, w, h} = setupCanvas($("phaseBox"));
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h)/W, ox = (w - W*s)/2, oy = h - (h - H*s)/2;
    ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.strokeRect(ox + .5, oy - H*s + .5, W*s - 1, H*s - 1);
    const cSolid = css("--c3"), cLiquid = css("--c0"), cGas = css("--edge");
    for (let i = 0; i < N; i++){
      ctx.fillStyle = nb[i] >= 6 ? cSolid : nb[i] <= 1 ? cGas : cLiquid;
      ctx.beginPath(); ctx.arc(ox + x[i]*s, oy - y[i]*s, .48*s, 0, Math.PI*2); ctx.fill();
    }
  }
  function label(){
    const state = ord > .3 ? "Solid: particles lock into a crystal" : vap > .3 ? "Gas: particles fill the box" : "Liquid: particles stay together but flow";
    $("phaseStatus").textContent = state + ".";
  }
  function tick(){
    for (let k = 0; k < STEPS; k++) step();
    if (++frame % 4 === 0){ neighbours(); label(); }
    draw();
    if (running) anim = requestAnimationFrame(tick);
  }
  function start(){
    reset(); neighbours(); label(); draw();
    if (reduced){ for (let k = 0; k < 4000; k++) step(); neighbours(); label(); draw(); return; }
    running = true; cancelAnimationFrame(anim); anim = requestAnimationFrame(tick);
    if ("IntersectionObserver" in window){
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting && !running){ running = true; anim = requestAnimationFrame(tick); }
        else if (!e.isIntersecting){ running = false; cancelAnimationFrame(anim); }
      })).observe($("phase-demo"));
    }
  }
  const tIn = $("temp");
  tIn.addEventListener("input", () => { T = +tIn.value; $("tempOut").textContent = T.toFixed(2);
    if (reduced){ for (let k = 0; k < 4000; k++) step(); neighbours(); label(); draw(); } });
  return { start, redraw: draw };
}

/* =========================================================
   3b. Branching process in a varying environment with two growth rates.
   In generation n each individual has 2 children, except that with probability
   p_n = 3^(-n)/5 it has a jackpot of K_n = 20·3^n children. Mean offspring ≈ 6.
   ========================================================= */
function bpveWidget(){
  const G = 30, RUNS = 40, DUR = 2600;
  let runs = [], anim = 0, shown = G;
  const std = () => { let u=0,v=0; while(!u) u=Math.random(); v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
  const poisson = l => { if (l > 30) return Math.max(0, Math.round(l + Math.sqrt(l)*std()));
    let k=0, p=1, L=Math.exp(-l); for(;;){ p*=Math.random(); if (p<=L) return k; k++; } };
  function one(){
    let Z = 1; const lz = [0];
    for (let n=0;n<G;n++){
      const p = Math.pow(3,-n)/5, K = 20*Math.pow(3,n);
      let J = 0;
      if (Z < 60){ for (let i=0;i<Z;i++) if (Math.random()<p) J++; } else J = Math.min(Z, poisson(Z*p));
      Z = 2*(Z-J) + K*J; lz.push(Math.log10(Z));
    }
    return lz;
  }
  const L2 = Math.log10(2), L6 = Math.log10(6), cut = n => n*(L2+L6)/2 + 1.5;
  const fast = r => r[G] > cut(G);
  function draw(){
    const {ctx,w,h} = setupCanvas($("bpvePlot")); ctx.clearRect(0,0,w,h);
    const top = Math.ceil(G*L6/5)*5 + 1;
    const pL=44, pR=44, pT=10, pB=42, X = n => pL + n/G*(w-pL-pR), Y = l => pT + (1-l/top)*(h-pT-pB);
    const muted=css("--muted"), rule=css("--rule"), cF=css("--accent"), cS=css("--c1");
    ctx.font = `12px ${css("--sans")}`; ctx.strokeStyle=rule; ctx.fillStyle=muted; ctx.lineWidth=1;
    for (let l=0;l<=top;l+=5){ ctx.beginPath(); ctx.moveTo(pL,Math.round(Y(l))+.5); ctx.lineTo(w-pR,Math.round(Y(l))+.5); ctx.stroke();
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(l===0?"1":"10"+String(l).split("").map(d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]).join(""), pL-8, Y(l)); }
    ctx.textAlign="center"; ctx.textBaseline="top";
    for (let n=0;n<=G;n+=5) ctx.fillText(String(n), X(n), h-pB+8);
    ctx.fillText("generation", (X(0)+X(G))/2, h-pB+24);
    ctx.setLineDash([4,4]); ctx.strokeStyle=muted; ctx.lineWidth=1;
    for (const [lg,lab] of [[L2,"2ⁿ"],[L6,"6ⁿ"]]){ ctx.beginPath(); ctx.moveTo(X(0),Y(0)); ctx.lineTo(X(G),Y(G*lg)); ctx.stroke();
      ctx.textAlign="left"; ctx.textBaseline="middle"; ctx.fillText(lab, X(G)+6, Y(G*lg)); }
    ctx.setLineDash([]); ctx.lineWidth=1.4; ctx.globalAlpha=.75;
    for (const r of runs){ ctx.strokeStyle = fast(r) ? cF : cS; ctx.beginPath(); ctx.moveTo(X(0),Y(r[0]));
      for (let n=1;n<=shown;n++) ctx.lineTo(X(n),Y(r[n])); ctx.stroke(); }
    ctx.globalAlpha=1;
  }
  function stat(){
    const f = runs.filter(fast).length;
    $("bpveStatus").textContent = `Of ${RUNS} runs, ${f} grew like 6ⁿ and ${RUNS-f} like 2ⁿ.`;
  }
  function start(){
    cancelAnimationFrame(anim); runs = Array.from({length:RUNS}, one); $("bpveStatus").textContent = "";
    if (reduced){ shown = G; draw(); stat(); return; }
    const t0 = performance.now();
    const tick = now => { const u = Math.min(1,(now-t0)/DUR); shown = Math.max(1, Math.round(u*G)); draw(); if (u<1) anim = requestAnimationFrame(tick); else stat(); };
    anim = requestAnimationFrame(tick);
  }
  $("bpveRun").addEventListener("click", start);
  return { start, redraw: draw };
}

/* =========================================================
   2c. Super-linear preferential attachment with fitness (Iyer–Lodewijks).
   Vertex i has weight W_i with density ∝ w^(−α) on [1, ∞) and receives each
   newcomer with probability ∝ (children_i + 1)^p + W_i, here p = 2.
   In the limit: a single vertex of infinite degree if p(α − 1) > 1,
   a locally finite tree with a unique infinite path if p(α − 1) < 1.
   ========================================================= */
function slWidget(){
  const N = 3000, P = 2, CHECK = [];
  for (let k=10; k<=N; k=Math.ceil(k*1.08)) CHECK.push(k);
  let g = null, anim = 0;
  function grow(alpha){
    const W = new Float64Array(N), kids = new Int32Array(N), parent = new Int32Array(N).fill(-1), depth = new Int32Array(N), f = new Float64Array(N);
    const fw = new Fenwick(N), drawW = () => Math.pow(1-Math.random(), -1/(alpha-1));
    W[0] = drawW(); f[0] = 1 + W[0]; fw.add(0, f[0]);
    let n = 1, hub = 0; const trace = [];
    return { W, kids, parent, depth, trace, get n(){return n;}, get hub(){return hub;},
      step(k){ for (let r=0; r<k && n<N; r++){
        let v = fw.find(Math.random()*fw.total); if (v>=n) v = n-1;
        parent[n] = v; depth[n] = depth[v]+1; kids[v]++;
        const nf = Math.pow(kids[v]+1, P) + W[v]; fw.add(v, nf-f[v]); f[v] = nf;
        if (kids[v] > kids[hub]) hub = v;
        W[n] = drawW(); f[n] = 1 + W[n]; fw.add(n, f[n]); n++;
        if (n === CHECK[trace.length]) trace.push([n, depth[hub], kids[hub]/(n-1)]);
      } return n < N; } };
  }
  function drawTree(){
    if (!g) return;
    const lo = css("--fitlo"), hi = css("--fithi"), lw = Math.log(1000);
    drawRadialTree($("slTree"), g.parent, g.n,
      i => lerpColor(lo, hi, Math.min(1, Math.log(g.W[i])/lw)),
      i => 1.2 + 2.0*Math.log(1 + g.kids[i]), g.hub, g.hub);
  }
  function drawChart(){
    const {ctx,w,h} = setupCanvas($("slChart")); ctx.clearRect(0,0,w,h); if (!g) return;
    const pL=40, pR=12, pT=10, pB=40, top = 12, lx0 = Math.log(10), lx1 = Math.log(N);
    const X = n => pL + (Math.log(n)-lx0)/(lx1-lx0)*(w-pL-pR), Y = d => pT + (1-d/top)*(h-pT-pB);
    const muted=css("--muted"), rule=css("--rule"), acc=css("--accent");
    ctx.font = `12px ${css("--sans")}`; ctx.lineWidth=1; ctx.strokeStyle=rule; ctx.fillStyle=muted;
    for (let d=0; d<=top; d+=3){ ctx.beginPath(); ctx.moveTo(pL,Math.round(Y(d))+.5); ctx.lineTo(w-pR,Math.round(Y(d))+.5); ctx.stroke();
      ctx.textAlign="right"; ctx.textBaseline="middle"; ctx.fillText(String(d), pL-6, Y(d)); }
    ctx.textAlign="center"; ctx.textBaseline="top";
    for (const n of [10,100,1000]) ctx.fillText(n.toLocaleString("en-GB"), X(n), h-pB+6);
    ctx.fillText("vertices (log scale)", (X(10)+X(N))/2, h-pB+22);
    ctx.strokeStyle = acc; ctx.lineWidth = 2.2; ctx.beginPath();
    g.trace.forEach(([n,d],i) => { const y = Y(Math.min(d,top)); if (i){ ctx.lineTo(X(n), Y(Math.min(g.trace[i-1][1],top))); ctx.lineTo(X(n), y); } else ctx.moveTo(X(n), y); });
    ctx.stroke();
  }
  function verdict(a){
    const c = P*(a-1);
    $("slVerdict").textContent = Math.abs(c-1) < 1e-9
      ? `α = ${a.toFixed(2)}: p(α − 1) = 1, the boundary between the two regimes.`
      : c > 1
      ? `α = ${a.toFixed(2)}: p(α − 1) = ${c.toFixed(2)} > 1. Heavy weights are rare enough that one vertex keeps its lead; in the limit it has infinite degree.`
      : `α = ${a.toFixed(2)}: p(α − 1) = ${c.toFixed(2)} < 1. Ever heavier newcomers keep taking over, each attached near the last leader; in the limit no vertex has infinite degree, and the tree has a single infinite path.`;
  }
  function stat(){
    const t = g.trace[g.trace.length-1];
    $("slStatus").textContent = `After ${fmt(g.n)} vertices, the largest hub has ${Math.round(t[2]*100)}% of all edges and sits ${t[1]} step${t[1]===1?"":"s"} from the root.`;
  }
  function start(){
    cancelAnimationFrame(anim);
    const a = alpha(); verdict(a); g = grow(a); $("slStatus").textContent = "";
    if (reduced){ g.step(N); drawTree(); drawChart(); stat(); return; }
    const tick = () => { const more = g.step(20); drawTree(); drawChart(); if (more) anim = requestAnimationFrame(tick); else stat(); };
    anim = requestAnimationFrame(tick);
  }
  const alpha = bindSlider("slAlpha", 2, verdict, start);
  $("slRun").addEventListener("click", start);
  return { start, redraw(){ drawTree(); drawChart(); } };
}

/* ---------- boot ---------- */
const widgets = {};
const defs = [["phase-demo", phaseWidget], ["self-demo", selfWidget], ["leadership-demo", urnWidget], ["pa-demo", paWidget], ["learn-demo", learnWidget],
              ["gel-demo", gelWidget], ["fit-demo", fitWidget], ["sl-demo", slWidget], ["cmj-demo", cmjWidget], ["bpve-demo", bpveWidget], ["bandit-demo", banditWidget]];
function boot(){
  // Build each widget independently, so one failure cannot stop the others.
  for (const [id, mk] of defs) if ($(id)) { try { widgets[id] = mk(); } catch (e) { console.error("simulation " + id + " failed to load", e); } }
  const ids = Object.keys(widgets);
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target); try { widgets[e.target.id].start(); } catch (err) { console.error("simulation " + e.target.id + " failed to start", err); }
    }), { rootMargin: "0px 0px -15% 0px" });
    ids.forEach(id => io.observe($(id)));
  } else ids.forEach(id => { try { widgets[id].start(); } catch (err) { console.error(err); } });
}
let rz = 0;
const redrawAll = () => Object.values(widgets).forEach(w => w.redraw());
window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(redrawAll, 120); });
if (window.matchMedia) { const mq = matchMedia("(prefers-color-scheme: dark)"); mq.addEventListener && mq.addEventListener("change", redrawAll); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else boot();
})();
