/* ===== LAB NOTEBOOK ===== */
chrome("explorer");
const q=new URLSearchParams(location.search),E=byId(q.get("experiment")||""),idx=E?E.subExperiments.findIndex(s=>s.id===q.get("sub")):-1,app=$("#app");
if(idx<0){app.innerHTML=`<section class="crumb"><h1>Module not found</h1><p><a href="index.html#explorer">Back to the explorer</a></p></section>`}
else{const s=E.subExperiments[idx],n=E.subExperiments.length,url=m=>`subexperiment.html?experiment=${E.id}&sub=${m.id}`,ov=`experiment.html?id=${E.id}`;
const prev=idx?url(E.subExperiments[idx-1]):ov,next=idx<n-1?url(E.subExperiments[idx+1]):ov,fin=()=>!!done()[s.id];
document.title=`${s.id} ${s.name} · MBU Data Science Lab`;
/* sample indicators derived from the module id so each module shows stable bars */
const h=[...s.id].reduce((a,c)=>(a*31+c.charCodeAt(0))%97,7),V=[["Completeness",70+h%30],["Output match",80+h%20],["Reproducibility",75+h%25]];
const sec=(t,b)=>`<h3>${t}</h3>${b}`;
app.innerHTML=`<section class="crumb exh"><div class="k"><a href="experiment.html?id=${E.id}">EXPERIMENT ${E.id}</a> / MODULE ${idx+1} OF ${n}</div><h1>${s.id} · ${esc(s.name.toUpperCase())}</h1>
<div class="pn"><a class="btn s g" href="${prev}">← PREVIOUS</a><div class="ltr" role="navigation" aria-label="Modules">${E.subExperiments.map(m=>`<a href="${url(m)}" class="${m===s?"on":""}" aria-label="Module ${m.id}">${m.id.slice(-1)}</a>`).join("")}</div><a class="btn s g" href="${next}">NEXT →</a></div></section>
<div class="nbx"><nav class="nbn" aria-label="Module navigation">${E.subExperiments.map(m=>`<a href="${url(m)}" class="${m===s?"on":""}">${m.id} ${esc(m.name)}${done()[m.id]?" ✓":""}</a>`).join("")}</nav>
<article class="nb">${sec("AIM",`<p>${esc(s.aim)}</p>`)}${sec("PROBLEM",`<p>${esc(s.problemStatement)}</p>`)}${sec("TOOLS",`<p>${s.tools.map(esc).join(", ")}</p>`)}${sec("CONCEPT",`<p>${esc(s.explanation)}</p>`)}
${sec("PROCEDURE",`<ol>${s.procedure.map(p=>`<li>${esc(p)}</li>`).join("")}</ol>`)}
${sec("CODE",`<div class="code"><div><span>PYTHON</span><button id="cp">COPY</button></div><pre><code>${esc(s.code)}</code></pre></div>`)}
${sec("EXPECTED INPUT",`<p>${esc(s.input)}</p>`)}${sec("OUTPUT",`<div class="con"><div>OUTPUT CONSOLE</div><pre>${esc(s.result)}</pre></div>`)}
${sec("RESULT INDICATORS (SAMPLE RUN)",`<div class="vz">${V.map(([l,v])=>`<div><span>${l}</span><span class="pb"><i data-w="${v}"></i></span><b>${v}%</b></div>`).join("")}</div>`)}
${sec("ANALYSIS",`<p>${esc(s.analysis)}</p>`)}${sec("CONCLUSION",`<p>${esc(s.conclusion)}</p>`)}
<p style="margin-top:28px"><button class="btn" id="fin"></button></p></article></div>`;
requestAnimationFrame(()=>$$(".pb i").forEach(i=>i.style.width=i.dataset.w+"%"));
/* copy: Clipboard API with execCommand fallback */
$("#cp").onclick=async b=>{const t=s.code,btn=$("#cp");try{await navigator.clipboard.writeText(t)}catch{const a=document.createElement("textarea");a.value=t;document.body.append(a);a.select();document.execCommand("copy");a.remove()}
btn.textContent="✓ COPIED";setTimeout(()=>btn.textContent="COPY",1500)};
const paint=()=>$("#fin").textContent=fin()?"✓ Completed — undo":"Mark module complete";paint();
$("#fin").onclick=()=>{const d=done();fin()?delete d[s.id]:d[s.id]=true;store.set("done",d);paint();$$(".nbn a")[idx].textContent=`${s.id} ${s.name}${fin()?" ✓":""}`}}
