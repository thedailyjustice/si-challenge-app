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
export function mount(el,save,runs=[]){
 el.innerHTML=`<div class="card"><h2>Quake Forecaster</h2><p>Each dot is a real magnitude 6+ earthquake (USGS). The model only sees quakes from <b>2016–2020</b>. It forecasts which map squares will have a quake in <b>2021–2025</b>, then we check it against what really happened.</p>
 <canvas id="map" width="${W}" height="${H}" aria-label="World map of earthquake forecasts"></canvas>
 <p><small>Red square: model said risk. Bright dots: 2021–2025 quakes it was trying to forecast. Faint dots: 2016–2020 quakes it learned from.</small></p>
 <fieldset class="card"><legend>Engineer it (STEM Innovators 3.4, 3.5)</legend>
 <label>How far the model looks around each square: <input type="range" id="rad" min="0" max="3" value="0"> <b id="radv">0</b> squares</label><br>
 <label>Past quakes needed to call it risky: <input type="range" id="cut" min="1" max="6" value="3"> <b id="cutv">3</b></label></fieldset>
 <p><button class="primary" id="train">Train and test</button> <button id="dots">Show/hide quakes</button></p><p id="out" aria-live="polite"></p>
 <table id="runs"><caption>Your test runs (first run is your baseline)</caption><thead><tr><th>Run</th><th>Look</th><th>Needed</th><th>Accuracy</th><th>Caught</th><th>Missed</th><th>False alarms</th><th>Change</th></tr></thead><tbody></tbody></table>
 <p><small>Think: is a high accuracy always good? What would happen if the model just said "no quake" everywhere? Look at Memphis and the middle of plates.</small></p></div>`;
 const $=q=>el.querySelector(q),cv=$('#map'),cx=cv.getContext('2d');let show=true,res=null;
 function draw(){cx.fillStyle='#09203a';cx.fillRect(0,0,W,H);
  if(res)for(const p of res.cells)if(p.h){cx.fillStyle='#ff7a7a66';cx.fillRect(p.c*CELL,p.r*CELL,CELL,CELL);}
  if(show)for(const q of QUAKES){const [x,y]=xy(q);cx.fillStyle=q[3]>=2021?'#ffb84d':'#ffb84d44';cx.fillRect(x-1.5,y-1.5,3,3);}}
 function table(){const b=runs[0]?.acc;$('#runs tbody').innerHTML=runs.map((r,i)=>`<tr><td>${i+1}</td><td>${r.rad}</td><td>${r.cut}</td><td>${r.acc}%</td><td>${r.tp}</td><td>${r.fn}</td><td>${r.fp}</td><td>${i?(r.acc-b>=0?'+':'')+(r.acc-b)+' pts':'baseline'}</td></tr>`).join('');}
 for(const id of ['rad','cut'])$('#'+id).oninput=e=>$('#'+id+'v').textContent=e.target.value;
 $('#dots').onclick=()=>{show=!show;draw();};
 $('#train').onclick=()=>{const rad=+$('#rad').value,cut=+$('#cut').value;res=forecast(rad,cut);
  $('#out').textContent=`Accuracy ${res.acc}%. Caught ${res.tp} quake areas, missed ${res.fn}, false alarms ${res.fp}. A model that always says "no quake" would score ${res.baseline}%.`;
  runs.push({rad,cut,acc:res.acc,tp:res.tp,fn:res.fn,fp:res.fp});save({runs:runs.slice(-50)});table();draw();};
 table();draw();}
