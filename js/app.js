import {updateMastery,initMastery,advise} from './coach.js';import {mount} from './station.js';import {validatePack,loadUploaded,saveUploaded,PACKS_KEY} from './packs.js';
const BUILTIN=await (await fetch('packs/8-ESS3-1.json')).json();const QUAKE_PACK='8-ESS3-1';
const KEY='faultline-v2',OLD='faultline-v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const blank=()=>({mastery:initMastery(),answered:0,mis:{},log:[]});
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.packs)return s;}catch{}
 const s={sel:QUAKE_PACK,packs:{},runs:[]};
 try{const o=JSON.parse(localStorage.getItem(OLD));if(o){s.packs[QUAKE_PACK]={mastery:o.mastery??initMastery(),answered:o.answered||0,mis:o.mis||{},log:o.log||[]};s.runs=o.runs||[];
  localStorage.setItem(KEY,JSON.stringify(s));localStorage.removeItem(OLD);}}catch{}
 return s;}
let S=load(),UP=loadUploaded();
const persist=()=>localStorage.setItem(KEY,JSON.stringify(S));
const all=()=>[BUILTIN,...UP];const pack=()=>all().find(p=>p.id===S.sel)||BUILTIN;
const st=(id=pack().id)=>S.packs[id]||(S.packs[id]=blank());
const save=p=>{if('runs' in p){S.runs=p.runs;}else Object.assign(st(),p);persist();};
const V=document.getElementById('view');const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
const shown=()=>{const s=st();return s.answered?s.mastery:0};
const bar=()=>`<div class="bar" role="progressbar" aria-label="Mastery" aria-valuenow="${Math.round(shown()*100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${shown()*100}%"></i></div><p><small>${Math.round(shown()*100)}% mastery · ${st().answered} answered</small></p>`;
function navSync(){const q=pack().id===QUAKE_PACK;document.querySelector('[data-go="station"]').hidden=!q;}
const views={
home(){const p=pack();V.innerHTML=`<div class="card"><label>Standard: <select id="pick">${all().map(x=>`<option value="${esc(x.id)}"${x.id===p.id?' selected':''}>${esc(x.code)}: ${esc(x.title)}${x===BUILTIN?' (built in)':''}</option>`).join('')}</select></label>
 <h2>${esc(p.code)}: ${esc(p.title)}</h2><p>${esc(p.text)}</p><p>Mastery</p>${bar()}<p><button class="primary" data-go="practice">Start practice</button></p></div>`;
 V.querySelector('#pick').onchange=e=>{S.sel=e.target.value;persist();navSync();go('home');};},
practice(){let i=0;const p=pack(),set=shuffle(p.items);
 const show=()=>{if(i>=set.length)return go('coach');const it=set[i],ch=shuffle(it.c);
  V.innerHTML=`<div class="card"><p><small>Question ${i+1} of ${set.length} · ${esc(p.code)}</small></p><h2>${esc(it.q)}</h2><div class="choices">${ch.map(([t],k)=>`<button data-k="${k}">${esc(t)}</button>`).join('')}</div><p id="fb" aria-live="polite"></p></div>${bar()}`;
  V.querySelectorAll('.choices button').forEach(b=>b.onclick=()=>{const m=ch[+b.dataset.k][1],ok=m===null,s=st();
   V.querySelectorAll('.choices button').forEach(x=>{x.disabled=true;if(ch[+x.dataset.k][1]===null)x.classList.add('ok')});if(!ok)b.classList.add('bad');
   const mis={...s.mis};if(m)mis[m]=(mis[m]||0)+1;
   save({mastery:updateMastery(s.mastery,ok),answered:s.answered+1,mis,log:[...s.log,{id:it.id,ok,m:m||null,t:Date.now()}].slice(-200)});
   const fb=V.querySelector('#fb');fb.textContent=ok?'Correct. ':'Not quite. '+p.misconceptions[m]+' ';
   const nx=document.createElement('button');nx.className='primary';nx.id='nx';nx.textContent='Next';fb.append(nx);
   nx.onclick=()=>{i++;show()};nx.focus();});};show();},
station(){if(pack().id!==QUAKE_PACK)return go('home');mount(V,save,(S.runs||[]).filter(r=>"rad" in r));},
coach(){const p=pack(),q=p.id===QUAKE_PACK;let a=advise(st(),p.misconceptions);if(!q&&a.next==='station')a={...a,msg:a.tag?a.msg:'Your mastery looks strong. Keep practicing to stay sharp.',next:'practice'};
 V.innerHTML=`<div class="card"><h2>Coach</h2><p>${esc(a.msg)}</p><p>Mastery</p>${bar()}<p><button class="primary" data-go="${a.next}">Go to ${a.next==='station'?'Quake Forecaster':'practice'}</button></p><p><small>The coach runs only on this device. It counts which wrong answers you choose and estimates mastery with Bayesian Knowledge Tracing.</small></p></div>`;},
teacher(){V.innerHTML=`<div class="card"><h2>Teacher: bring your standards</h2><p>Load a standard pack (.json) or paste one below. Packs are checked, then saved only on this device. Nothing is uploaded anywhere. The format is described in README.md (packs/schema.json).</p>
 <p><label>Load a file: <input type="file" id="file" accept=".json,application/json"></label></p>
 <p><label for="paste">Or paste JSON:</label><br><textarea id="paste" rows="8" style="width:100%"></textarea></p><p><button class="primary" id="add">Check and add pack</button></p>
 <div id="msg" aria-live="polite"></div><h3>Loaded packs</h3><ul id="list"></ul></div>`;
 const msg=V.querySelector('#msg');
 const list=()=>{const ul=V.querySelector('#list');ul.replaceChildren();for(const p of all()){const li=document.createElement('li');li.textContent=`${p.code}: ${p.title} (${p.items.length} questions) `;
  if(p===BUILTIN){const s=document.createElement('small');s.textContent='built in';li.append(s);}else{const b=document.createElement('button');b.textContent='Remove';b.dataset.rm=p.id;b.setAttribute('aria-label','Remove '+p.code);
   b.onclick=()=>{if(!confirm(`Remove "${p.code}" and its progress from this device?`))return;UP=UP.filter(x=>x.id!==p.id);saveUploaded(UP);delete S.packs[p.id];if(S.sel===p.id)S.sel=QUAKE_PACK;persist();navSync();list();};li.append(b);}
  ul.append(li);}};
 const add=txt=>{msg.replaceChildren();let p,errs;try{p=JSON.parse(txt)}catch(e){errs=['This is not valid JSON. Check for missing commas, quotes or brackets. ('+e.message+')']}
  if(!errs)errs=validatePack(p,all().map(x=>x.id));
  const h=document.createElement('p');msg.append(h);
  if(errs.length){h.className='bad';h.textContent=`This pack was not added. Fix ${errs.length===1?'this problem':'these '+errs.length+' problems'}:`;const ul=document.createElement('ul');for(const e of errs){const li=document.createElement('li');li.textContent=e;ul.append(li);}msg.append(ul);return;}
  const clean={id:p.id,code:p.code,title:p.title,text:p.text,grade:p.grade,items:p.items.map(i=>({id:i.id,q:i.q,c:i.c.map(c=>[c[0],c[1]])})),misconceptions:{...p.misconceptions}};
  UP=[...UP,clean];saveUploaded(UP);h.className='ok';h.textContent=`Added "${p.code}" with ${p.items.length} questions. Pick it on Home.`;list();};
 V.querySelector('#add').onclick=()=>add(V.querySelector('#paste').value);
 V.querySelector('#file').onchange=e=>{const f=e.target.files[0];if(f)f.text().then(add);};
 list();}
};
function go(v){(views[v]||views.home)();V.focus();}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go);});
document.getElementById('reset').onclick=()=>{if(confirm('Clear everything on this device? This erases all progress for every standard, your Forecaster runs, and all uploaded teacher packs.')){for(const k of [KEY,OLD,PACKS_KEY])localStorage.removeItem(k);S=load();UP=[];navSync();go('home');}};
navSync();go('home');
