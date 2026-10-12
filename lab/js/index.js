/* ===== DASHBOARD ===== */
chrome("top");
const CATS=["ALL","PYTHON","DATA","VISUALIZATION","ML","STATISTICS"];
let filter="ALL",all=()=>EXPERIMENTS;
/* animated hero background: drifting data points joined by lines */
(function(){const c=$("#bg"),x=c.getContext("2d"),still=matchMedia("(prefers-reduced-motion:reduce)").matches;let W,H,P=[];
function size(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;P=Array.from({length:Math.min(70,W/14)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}))}
function draw(){x.clearRect(0,0,W,H);const col=getComputedStyle(document.documentElement).getPropertyValue("--cy").trim();x.fillStyle=col;x.strokeStyle=col;
P.forEach((p,i)=>{if(!still){p.x=(p.x+p.vx+W)%W;p.y=(p.y+p.vy+H)%H}x.globalAlpha=.8;x.fillRect(p.x,p.y,2.5,2.5);
for(let j=i+1;j<P.length;j++){const d=Math.hypot(p.x-P[j].x,p.y-P[j].y);if(d<110){x.globalAlpha=(1-d/110)*.25;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(P[j].x,P[j].y);x.stroke()}}});
if(!still)requestAnimationFrame(draw)}
size();draw();addEventListener("resize",()=>{size();if(still)draw()})})();
/* analytics counters, computed from data */
function stats(){const E=all(),subs=E.reduce((n,e)=>n+e.subExperiments.length,0),d=done(),c=E.filter(e=>status(e)==="COMPLETED").length;
const S=[["EXPERIMENTS",E.length],["SUB-EXPERIMENTS",subs],["COMPLETED",c+" / "+E.length],["LAB STATUS","ACTIVE"]];
$("#stats").innerHTML=S.map(([l,v])=>`<div><span class="k">${l}</span><b data-v="${v}">${v}</b></div>`).join("");
$$("#stats b").forEach(b=>{const t=+b.dataset.v;if(!t&&t!==0||isNaN(t)||String(t)!==b.dataset.v)return;if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;let s=null;const f=ts=>{s=s||ts;const p=Math.min((ts-s)/900,1);b.textContent=Math.round(t*p);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
/* learning pipeline: each stage applies a category filter */
const STAGES=[["Foundation","Python"],["Data Handling","Data"],["Cleaning","Data"],["Visualization","Visualization"],["Machine Learning","ML"],["Model Evaluation","ML"]];
$("#pipe").innerHTML=STAGES.map(([n,c],i)=>`<button class="st" style="--i:${i}" data-c="${c}"><b>0${i+1} ${n}</b><span>Shows ${c} experiments</span></button>`).join("");
$$(".st").forEach(b=>b.onclick=()=>{setFilter(b.dataset.c.toUpperCase());$("#explorer").scrollIntoView()});
/* filters + search */
function setFilter(f){filter=f;$$(".chip").forEach(c=>{c.classList.toggle("on",c.textContent===f);c.setAttribute("aria-pressed",c.textContent===f)});render()}
$("#chips").innerHTML=CATS.map(c=>`<button class="chip" aria-pressed="false">${c}</button>`).join("");
$$(".chip").forEach(c=>c.onclick=()=>setFilter(c.textContent));
$("#q").oninput=render;
addEventListener("keydown",e=>{if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$("#dlg").open){e.preventDefault();$("#q").focus();$("#explorer").scrollIntoView()}});
const hay=e=>[e.id,e.name,e.description,e.category,...e.keywords,...e.technologies,...e.subExperiments.map(s=>s.name)].join(" ").toLowerCase();
function render(){const q=$("#q").value.trim().toLowerCase(),L=all().filter(e=>(filter==="ALL"||e.category.toUpperCase()===filter)&&(!q||hay(e).includes(q)));
$("#list").innerHTML=L.length?L.map(row).join(""):`<div class="empty"><b>No matching experiments</b><p>Try:<br>Python · Machine Learning · Visualization · Regression</p></div>`;
$$(".pb i").forEach(i=>requestAnimationFrame(()=>i.style.width=i.dataset.w+"%"));
$$(".xh").forEach(h=>h.onclick=()=>h.parentElement.classList.toggle("open"));
$$("[data-done]").forEach(b=>b.onclick=()=>{const e=byId(b.dataset.done),d=done(),all_=progress(e).n===progress(e).t;e.subExperiments.forEach(s=>all_?delete d[s.id]:d[s.id]=true);store.set("done",d);stats();render()});
$$("[data-del]").forEach(b=>b.onclick=()=>{const e=byId(b.dataset.del);if(confirm(`Delete custom experiment ${e.id} "${e.name}"? This cannot be undone.`)){store.set("custom",customList().filter(c=>c.id!==e.id));location.reload()}})}
function row(e){const p=progress(e),s=status(e),cl=s==="COMPLETED"?"c":s==="IN PROGRESS"?"p":"";
return`<article class="x"><button class="xh" aria-expanded="false"><span class="n">${e.id}</span><span><h3>${esc(e.name)}</h3><div class="tags">${[e.category,...e.technologies].map(t=>`<i>${esc(t.toUpperCase())}</i>`).join("")}</div></span><span class="stt ${cl}">${s}</span><span class="k">Explore</span></button>
<div class="xb"><div><div class="xin"><div><p>${esc(e.description)}</p><div class="mods">${e.subExperiments.map(m=>`<a href="subexperiment.html?experiment=${e.id}&sub=${m.id}" title="${esc(m.name)}">${m.id}</a>`).join("")}</div></div>
<div><span class="k">SUB-EXPERIMENTS</span><div class="pb"><i data-w="${p.pct}"></i></div><span class="k">${p.pct}% · ${p.n} / ${p.t} completed</span>
<div class="act"><a class="btn s" href="experiment.html?id=${e.id}">Open Experiment</a><button class="btn s g" data-done="${e.id}">${p.n===p.t?"Reset progress":"Mark completed"}</button>${e.custom?`<button class="btn s g" data-del="${e.id}">Delete</button>`:""}</div></div></div></div></div></article>`}
/* resources section */
$("#res").innerHTML=[["NumPy docs",DOCS.Python],["Pandas docs",DOCS.Data],["Matplotlib docs",DOCS.Visualization],["scikit-learn docs",DOCS.ML]].map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join("");
/* add-experiment modal; custom entries persist in localStorage */
const f=$("#frm");f.innerHTML=`<label>Experiment ID<input name="id" required pattern="[0-9A-Za-z]+" placeholder="11"></label><label>Experiment Name<input name="name" required></label>
<label>Category<select name="cat">${CATS.slice(1).map(c=>`<option>${c[0]+c.slice(1).toLowerCase().replace("ml","ML")}</option>`).join("").replace(">Ml<",">ML<")}</select></label><label>Technologies (comma separated)<input name="tech" placeholder="Python, Pandas"></label>
<label class="w">Description<textarea name="desc" rows="2" required></textarea></label><label>YouTube URL<input name="yt" type="url"></label><label>GitHub URL<input name="gh" type="url"></label>
${[...LET].map(l=>`<label>Sub-experiment ${l}<input name="s${l}" required></label>`).join("")}
<div class="w act"><button class="btn" value="save">Save experiment</button><button class="btn g" type="button" id="cancel">Cancel</button></div>`;
$("#add").onclick=()=>$("#dlg").showModal();$("#cancel").onclick=()=>$("#dlg").close();
f.onsubmit=ev=>{const v=Object.fromEntries(new FormData(f)),id=v.id.trim();
if(byId(id)){ev.preventDefault();alert("An experiment with ID "+id+" already exists.");return}
const tech=v.tech.split(",").map(t=>t.trim()).filter(Boolean),r=[id,v.name,v.cat,"Custom",tech.length?tech:["Python"],[v.name.toLowerCase()],v.desc,[0,0,0,0,0],[...LET].map(l=>S(v["s"+l],`# ${v["s"+l]}\n# Add your code here`,"Run your code to see output"))];
if(v.yt)r.youtube=v.yt;if(v.gh)r.github=v.gh;
const c=customList();c.push(build(r,true));store.set("custom",c);location.reload()};
/* active nav while scrolling */
const io=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){const k=x.target.id==="actions"?"explorer":x.target.id;$$("#nav a").forEach(a=>a.classList.toggle("on",a.dataset.k===k))}}),{rootMargin:"-40% 0px -55%"});
["top","explorer","pipeline","resources"].forEach(i=>io.observe($("#"+i)));
$$("#nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
stats();render();
