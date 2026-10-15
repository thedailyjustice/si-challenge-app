import {ITEMS,STANDARD,MISCONCEPTIONS} from './items.js';import {updateMastery,initMastery,advise} from './coach.js';import {mount} from './station.js';
const KEY='faultline-v1';const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}};
let S=Object.assign({mastery:initMastery(),answered:0,mis:{},log:[]},load());const save=p=>{Object.assign(S,p);localStorage.setItem(KEY,JSON.stringify(S));};
const V=document.getElementById('view');const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
const shown=()=>S.answered?S.mastery:0;const bar=()=>`<div class="bar" role="progressbar" aria-valuenow="${Math.round(shown()*100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${shown()*100}%"></i></div>`;
const views={
home(){V.innerHTML=`<div class="card"><h2>${STANDARD.code}: Earthquakes and volcanoes</h2><p>${STANDARD.text}</p><p>Mastery</p>${bar()}<p><button class="primary" data-go="practice">Start practice</button></p></div>`;},
practice(){let i=0;const set=shuffle(ITEMS);
 const show=()=>{if(i>=set.length)return go('coach');const it=set[i];
  V.innerHTML=`<div class="card"><p><small>Question ${i+1} of ${set.length} · ${STANDARD.code}</small></p><h2>${it.q}</h2><div class="choices">${shuffle(it.c).map(([t,m])=>`<button data-m="${m??''}">${t}</button>`).join('')}</div><p id="fb" aria-live="polite"></p></div>${bar()}`;
  V.querySelectorAll('.choices button').forEach(b=>b.onclick=()=>{const m=b.dataset.m,ok=!m;
   V.querySelectorAll('.choices button').forEach(x=>{x.disabled=true;if(!x.dataset.m)x.classList.add('ok')});if(!ok)b.classList.add('bad');
   const mis={...S.mis};if(m)mis[m]=(mis[m]||0)+1;
   save({mastery:updateMastery(S.mastery,ok),answered:S.answered+1,mis,log:[...S.log,{id:it.id,ok,m:m||null,t:Date.now()}].slice(-200)});
   V.querySelector('#fb').innerHTML=(ok?'Correct. ':'Not quite. '+MISCONCEPTIONS[m]+' ')+'<button class="primary" id="nx">Next</button>';
   V.querySelector('#nx').onclick=()=>{i++;show()};V.querySelector('#nx').focus();});};show();},
station(){mount(V,save,S.runs||[]);},
coach(){const a=advise(S,MISCONCEPTIONS);V.innerHTML=`<div class="card"><h2>Coach</h2><p>${a.msg}</p><p>Mastery</p>${bar()}<p><button class="primary" data-go="${a.next}">Go to ${a.next==='station'?'Quake Forecaster':'practice'}</button></p><p><small>The coach runs only on this device. It counts which wrong answers you choose and estimates mastery with Bayesian Knowledge Tracing.</small></p></div>`;}
};
function go(v){(views[v]||views.home)();V.focus();}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go);});
document.getElementById('reset').onclick=()=>{if(confirm('Clear all progress on this device?')){localStorage.removeItem(KEY);S={mastery:initMastery(),answered:0,mis:{},log:[]};go('home');}};
go('home');
