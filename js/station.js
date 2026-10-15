// Quake Forecaster: learn from real USGS M6+ quakes in 2016-2020, forecast which map areas have quakes in 2021-2025.
// Model: count past quakes within a radius of each cell; forecast "risk" if the count reaches a cutoff. Runs only on this device.
import {QUAKES} from './quakes.js';
const W=720,H=360,CELL=20,COLS=W/CELL,ROWS=H/CELL;
const xy=([la,lo])=>[(lo+180)/360*W,(90-la)/180*H];
export function cellCounts(list=QUAKES){const g=Array.from({length:ROWS},()=>Array(COLS).fill(0));
 for(const q of list){const [x,y]=xy(q);g[Math.min(ROWS-1,y/CELL|0)][Math.min(COLS-1,x/CELL|0)]++;}return g;}
const PAST=cellCounts(QUAKES.filter(q=>q[3]<=2020)),FUT=cellCounts(QUAKES.filter(q=>q[3]>=2021));
export function forecast(rad,cut){const out=[];let tp=0,fp=0,fn=0,tn=0;
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){let s=0;
  for(let dr=-rad;dr<=rad;dr++)for(let dc=-rad;dc<=rad;dc++){const rr=r+dr;if(rr<0||rr>=ROWS)continue;s+=PAST[rr][(c+dc+COLS)%COLS];}
  const h=s>=cut,y=FUT[r][c]>0;if(h&&y)tp++;else if(h)fp++;else if(y)fn++;else tn++;out.push({r,c,h,y});}
 const n=ROWS*COLS;return {cells:out,tp,fp,fn,tn,acc:Math.round((tp+tn)/n*100),baseline:Math.round((fp+tn)/n*100)};}
export const GUIDE_KEY='faultline-guide';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let TX=null;const BASE={rad:0,cut:3};
const lg=()=>{try{return JSON.parse(localStorage.getItem(GUIDE_KEY))||{}}catch{return{}}};
export async function mount(el,save,runs=[]){
 TX=TX||await (await fetch('packs/forecaster-text.json')).json();const T=TX;let G={step:1,...lg()};const sg=()=>localStorage.setItem(GUIDE_KEY,JSON.stringify(G));
 el.innerHTML=`<div class="card"><h2>${esc(T.title)}</h2><p class="mission"><b>${esc(T.mission)}</b></p><p>${esc(T.intro)}</p>
 <ol class="steps" aria-label="Guided steps">${T.stepNames.map((n,k)=>`<li data-s="${k+1}">${k+1}. ${esc(n)}</li>`).join('')}</ol>
 <div id="guide" class="card" aria-live="polite"></div><div id="setslot"><fieldset class="card"><legend>Settings</legend>
 <label><b>${esc(T.radLabel)}:</b> <input type="range" id="rad" min="0" max="3" value="0"> <b id="radv">0</b> ${esc(T.squaresUnit)}</label><br><small>${esc(T.radWhy)}</small><br>
 <label><b>${esc(T.cutLabel)}:</b> <input type="range" id="cut" min="1" max="6" value="3"> <b id="cutv">3</b></label><br><small>${esc(T.cutWhy)}</small></fieldset></div>
 <canvas id="map" width="${W}" height="${H}" aria-label="World map of earthquake forecasts"></canvas>
 <p><small><b>${esc(T.red)}</b> ${esc(T.legend)}</small></p>
 <p id="freebar" hidden><button class="primary" id="train">Train and test</button> <button id="restart">${esc(T.restart)}</button></p><p><button id="dots">Show/hide quakes</button></p><p id="out" aria-live="polite"></p>
 <div id="free" hidden><p>${esc(T.freePlay)}</p><div class="scroll"><table id="runs"><caption>${esc(T.runsCaption)}</caption><thead><tr><th>Run</th><th>Look</th><th>Needed</th><th>Accuracy</th><th>Caught</th><th>Missed</th><th>False alarms</th><th>${esc(T.alwaysNoCol)}</th><th>Change</th></tr></thead><tbody></tbody></table></div><p><small>${esc(T.think)}</small></p></div></div>
 <div class="card" id="found" hidden><h2>${esc(T.findings.title)}</h2><ul>${T.findings.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
 <h3>Quick check</h3><p>${esc(T.check.q)}</p><div class="choices" id="chk">${T.check.choices.map((c,k)=>`<button data-k="${k}">${esc(c[0])}</button>`).join('')}</div><p id="chkfb" aria-live="polite"></p></div>`;
 const $=q=>el.querySelector(q),FS=el.querySelector('#setslot fieldset'),cv=$('#map'),cx=cv.getContext('2d');let show=true,res=null;
 const val=()=>({rad:+$('#rad').value,cut:+$('#cut').value});
 const setV=v=>{for(const k of ['rad','cut']){$('#'+k).value=v[k];$('#'+k+'v').textContent=v[k];}};
 function draw(){cx.fillStyle='#09203a';cx.fillRect(0,0,W,H);
  if(res)for(const p of res.cells)if(p.h){cx.fillStyle='#ff7a7a66';cx.fillRect(p.c*CELL,p.r*CELL,CELL,CELL);}
  if(show)for(const q of QUAKES){const [x,y]=xy(q);cx.fillStyle=q[3]>=2021?'#ffb84d':'#ffb84d44';cx.fillRect(x-1.5,y-1.5,3,3);}}
 function table(){const b=runs[0]?.acc;$('#runs tbody').innerHTML=runs.map((r,i)=>`<tr><td>${i+1}</td><td>${+r.rad}</td><td>${+r.cut}</td><td>${+r.acc}%</td><td>${+r.tp}</td><td>${+r.fn}</td><td>${+r.fp}</td><td>${r.base??''}%</td><td>${i?(r.acc-b>=0?'+':'')+(r.acc-b)+' pts':'baseline'}</td></tr>`).join('');}
 const run=v=>{res=forecast(v.rad,v.cut);const r={...v,acc:res.acc,tp:res.tp,fn:res.fn,fp:res.fp,base:res.baseline};
  $('#out').textContent=`Accuracy ${res.acc}%. Caught ${res.tp} quake areas, missed ${res.fn}, false alarms ${res.fp}. A model that always says "no quake" would score ${res.baseline}%.`;
  runs.push(r);save({runs:runs.slice(-50)});table();draw();return r;};
 const changed=()=>{const v=val();return (v.rad!==BASE.rad)+(v.cut!==BASE.cut)};
 function guide(){const g=$('#guide'),done=G.step>4;
  el.querySelectorAll('.steps li').forEach(li=>{const s=+li.dataset.s;li.className=s===G.step?'now':s<G.step?'done':'';if(s===G.step)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
  const lock=G.step===1||G.step===3||G.step===4;$('#rad').disabled=$('#cut').disabled=lock;
  $('#freebar').hidden=$('#free').hidden=$('#found').hidden=!done;g.hidden=done;
  if(done){$('#setslot').append(FS);return;}
  if((G.step===3||G.step===4)&&G.mine){setV(G.mine);res=forecast(G.mine.rad,G.mine.cut);draw();}
  if(G.step!==2)$('#setslot').append(FS);
  if(G.step===1){setV(BASE);g.innerHTML=`<p>${esc(T.step1.lead)}</p><p><b>${esc(T.step1.q)}</b></p><div class="choices">${[0,1,2].map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>[T.step1.choices[x[1]],x[1]]).map(([c,k])=>`<label><input type="radio" name="pred" value="${k}"> ${esc(c)}</label>`).join('')}</div><p><button class="primary" id="g1" disabled>${esc(T.step1.button)}</button></p>`;
   g.querySelectorAll('[name=pred]').forEach(r=>r.onchange=()=>{$('#g1').disabled=false});
   $('#g1').onclick=()=>{G.pred=+g.querySelector('[name=pred]:checked').value;G.base=run(BASE);G.step=2;sg();guide();};}
  if(G.step===2){g.innerHTML=`<p>${esc(T.step2.lead)}</p><div id="g2set"></div><p id="hint"></p><p><button class="primary" id="g2">${esc(T.step2.button)}</button></p>`;
   $('#g2set').append(FS);const upd=()=>{const n=changed();$('#g2').disabled=n!==1;$('#hint').textContent=n===1?'':n===0?T.step2.needOne:T.step2.tooMany;};upd();el._upd=upd;
   $('#g2').onclick=()=>{G.mine=run(val());G.step=3;sg();guide();};}
  if(G.step===3){const b=G.base,m=G.mine,R=T.step3.rows,k=Object.keys(R),u=x=>x==='acc'||x==='base'?'%':'';
   const pr=m.tp>b.tp&&m.fp>b.fp?0:m.tp<b.tp&&m.fp<b.fp?1:m.tp===b.tp&&m.fp===b.fp?2:-1;
   g.innerHTML=`<p>${esc(T.step3.lead)}</p><div class="scroll"><table id="cmp"><thead><tr>${T.step3.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${k.map(x=>{const d=m[x]-b[x];return `<tr><th>${esc(R[x])}</th><td>${b[x]}${u(x)}</td><td>${m[x]}${u(x)}</td><td>${d>0?'+':''}${d}${u(x)?' '+esc(T.step3.pointsUnit):''}</td></tr>`}).join('')}</tbody></table></div>
   <p><small>${esc(T.step3.accNote)}</small></p><p><small>${esc(T.step3.alwaysNoNote)}</small></p><p id="predfb">${esc(pr===G.pred?T.step3.predRight:T.step3.predWrong)}</p><p><button class="primary" id="g3">${esc(T.step3.button)}</button></p>`;
   $('#g3').onclick=()=>{G.step=4;sg();guide();};}
  if(G.step===4){g.innerHTML=`<p>${esc(T.step4.lead)}</p><p><b>${esc(T.step4.starter)}</b></p><label for="expl"><small>${esc(T.step4.hint)}</small></label><textarea id="expl" rows="3" style="width:100%"></textarea><p><button class="primary" id="g4" disabled>${esc(T.step4.button)}</button></p>`;
   const t=$('#expl');t.value=G.expl||'';const u=()=>{G.expl=t.value;sg();$('#g4').disabled=!t.value.trim();};t.oninput=u;u();
   $('#g4').onclick=()=>{G.step=5;sg();guide();};}}
 for(const id of ['rad','cut'])$('#'+id).oninput=e=>{$('#'+id+'v').textContent=e.target.value;el._upd&&G.step===2&&el._upd();};
 $('#dots').onclick=()=>{show=!show;draw();};
 $('#train').onclick=()=>run(val());
 $('#restart').onclick=()=>{G={step:1};sg();res=null;draw();guide();};
 el.querySelectorAll('#chk button').forEach(b=>b.onclick=()=>{const c=T.check.choices[+b.dataset.k];el.querySelectorAll('#chk button').forEach(x=>{x.classList.remove('bad');if(T.check.choices[+x.dataset.k][1]===null)x.classList.add('ok')});if(c[1])b.classList.add('bad');$('#chkfb').textContent=c[1]===null?c[2]:T.check.wrongLead+' '+T.check.misconceptions[c[1]];G.chk=c[1]===null;sg();});
 table();draw();guide();}
