/* ===== EXPERIMENT WORKSPACE ===== */
chrome("explorer");
const e=byId(new URLSearchParams(location.search).get("id")||"");
const app=$("#app");
if(!e){app.innerHTML=`<section class="crumb"><h1>Experiment not found</h1><p><a href="index.html#explorer">Back to the explorer</a></p></section>`}
else{document.title=`Experiment ${e.id} · MBU Data Science Lab`;
const d=e.dataset,p=progress(e),bar=(n,max)=>`<div class="pb"><i data-w="${max?Math.min(100,n/max*100):0}"></i></div>`;
app.innerHTML=`<section class="crumb exh"><div class="k"><a href="index.html#explorer">LAB</a> / EXPERIMENT ${e.id}</div><h1>${esc(e.name.toUpperCase())}</h1>
<div class="meta"><div><span class="k">CATEGORY</span><b>${esc(e.category)}</b></div><div><span class="k">LEVEL</span><b>${esc(e.level)}</b></div><div><span class="k">TOOLS</span><b>${e.technologies.map(esc).join(" • ")}</b></div><div><span class="k">MODULES</span><b>${e.subExperiments.length}</b></div></div>
<nav class="res" aria-label="Resources"><a href="${esc(e.youtube)}" target="_blank" rel="noopener">▶ VIDEO TUTORIAL</a><a href="${esc(e.github)}" target="_blank" rel="noopener">⌘ GITHUB</a><a href="${esc(e.dataUrl)}" target="_blank" rel="noopener">↓ DATASET</a><a href="${esc(e.docs)}" target="_blank" rel="noopener">◎ DOCUMENTATION</a></nav></section>
<section class="two"><article class="brief"><div class="k">EXPERIMENT BRIEF · ${p.pct}% COMPLETE</div>
${[["Overview",e.overview],["Aim",e.aim],["Problem Statement",e.problemStatement],["Dataset",`${d.records.toLocaleString()} records with ${d.features} features.`],["Methodology",e.methodology],["Analysis",e.analysis],["Results",e.results],["Conclusion",`Completing modules A-G gives a documented ${e.name.toLowerCase()} workflow.`]].map(([h,t])=>`<h3>${h}</h3><p>${esc(t)}</p>`).join("")}</article>
<aside class="side"><h3>DATA SCIENCE PIPELINE</h3><ol class="flowv">${e.architecture.map((a,i)=>`<li style="--i:${i}">${esc(a)}</li>`).join("")}</ol>
<h3>DATASET INTELLIGENCE</h3>${[["Records",d.records,d.records],["Features",d.features,30],["Numeric",d.numeric,d.features],["Categorical",d.categorical,d.features],["Missing Values",d.missing,d.records/50]].map(([l,n,m])=>`<div class="di"><span>${l}</span><b>${n.toLocaleString()}</b>${bar(n,m)}</div>`).join("")}</aside></section>
<section><h2>Modules</h2>${e.subExperiments.map((s,i)=>`<div class="mod"><span class="l">${LET[i]}</span><div><b>${esc(s.name)}</b><p>${esc(s.aim)} · ${s.tools.map(esc).join(", ")}</p><span class="k">${done()[s.id]?"COMPLETED":"AVAILABLE"}</span></div><a class="btn s" href="subexperiment.html?experiment=${e.id}&sub=${s.id}">Open ${s.id}</a></div>`).join("")}</section>`;
requestAnimationFrame(()=>$$(".pb i").forEach(i=>i.style.width=i.dataset.w+"%"))}
