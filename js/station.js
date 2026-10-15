// Quake Forecaster: students label grid cells, a k-nearest-neighbor model learns from real USGS data, then is tested on a held-out region.
import {QUAKES} from './quakes.js';
const W=720,H=360,CELL=20,COLS=W/CELL,ROWS=H/CELL;
const xy=([la,lo])=>[(lo+180)/360*W,(90-la)/180*H];
export function cellCounts(list=QUAKES){const g=Array.from({length:ROWS},()=>Array(COLS).fill(0));
 for(const q of list){const [x,y]=xy(q);g[Math.min(ROWS-1,y/CELL|0)][Math.min(COLS-1,x/CELL|0)]++;}return g;}
export function knn(train,cell,k=5){const d=train.map(t=>[(t.r-cell.r)**2+(t.c-cell.c)**2,t.y]).sort((a,b)=>a[0]-b[0]).slice(0,k);
 return d.filter(v=>v[1]).length/d.length;}
export function mount(el,save){
 el.innerHTML=`<div class="card"><h2>Quake Forecaster</h2><p>Each dot is a real magnitude 6+ earthquake from 2016 to 2025 (USGS). The <b>left half</b> of the map is training data. Tap <b>Train</b>, and the model learns which areas are high risk. Then it forecasts the <b>right half</b>, which it has never seen.</p>
 <canvas id="map" width="${W}" height="${H}" aria-label="World map of earthquake locations"></canvas>
 <p><button class="primary" id="train">Train and test</button> <button id="dots">Show/hide quakes</button></p><p id="out" aria-live="polite"></p>
 <p><small>Think: where is the model wrong, and why? Look near Hawaii and the middle of plates.</small></p></div>`;
 const cv=el.querySelector('#map'),cx=cv.getContext('2d');let show=true,pred=null;
 const g=cellCounts();
 function draw(){cx.fillStyle='#09203a';cx.fillRect(0,0,W,H);
  cx.strokeStyle='#ffffff55';cx.beginPath();cx.moveTo(W/2,0);cx.lineTo(W/2,H);cx.stroke();
  if(pred)for(const p of pred){cx.fillStyle=p.p>=.5?'#ff7a7a66':'#5fd38d33';cx.fillRect(p.c*CELL,p.r*CELL,CELL,CELL);}
  if(show){cx.fillStyle='#ffb84d';for(const q of QUAKES){const [x,y]=xy(q);cx.fillRect(x-1.5,y-1.5,3,3);}}}
 draw();
 el.querySelector('#dots').onclick=()=>{show=!show;draw();};
 el.querySelector('#train').onclick=()=>{
  const train=[],test=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const t={r,c,y:g[r][c]>0?1:0};(c<COLS/2?train:test).push(t);}
  // features are only neighbor positions in the training half, mirrored by distance: deliberately simple so students can find its limits
  pred=test.map(t=>{const near=train.filter(s=>Math.abs(s.r-t.r)<=2);return {...t,p:knn(near.length?near:train,{r:t.r,c:t.c-COLS/2})};});
  let tp=0,fp=0,fn=0,tn=0;for(const p of pred){const h=p.p>=.5;if(h&&p.y)tp++;else if(h)fp++;else if(p.y)fn++;else tn++;}
  const acc=((tp+tn)/pred.length*100).toFixed(0);
  el.querySelector('#out').textContent=`Model accuracy on the unseen half: ${acc}%. Caught ${tp} quake areas, missed ${fn}, false alarms ${fp}.`;
  save({trained:true,acc:+acc,missed:fn,falseAlarms:fp});draw();};}
