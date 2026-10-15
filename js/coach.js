// On-device coach: Bayesian Knowledge Tracing for mastery + misconception counts. No network.
const P={init:.2,learn:.15,slip:.1,guess:.25};
export function updateMastery(p,correct){
 const post=correct? p*(1-P.slip)/(p*(1-P.slip)+(1-p)*P.guess) : p*P.slip/(p*P.slip+(1-p)*(1-P.guess));
 return post+(1-post)*P.learn;}
export const initMastery=()=>P.init;
export function advise(state,MIS){
 const tags=Object.entries(state.mis||{}).sort((a,b)=>b[1]-a[1]);
 const m=state.mastery??P.init;
 if(!state.answered) return {msg:"Answer a few practice questions and I'll look for patterns in your misses.",next:"practice"};
 if(tags.length&&tags[0][1]>=2){const [t,n]=tags[0];
  const next=(t==='random'||t==='center'||t==='hotspot')?'station':'practice';
  return {msg:`You picked answers like this ${n} times: ${MIS[t]}`,next,tag:t};}
 if(m>=.95) return {msg:"Your mastery looks strong. Try training the Quake Forecaster and find where it fails.",next:"station"};
 return {msg:"No strong pattern yet. Keep practicing.",next:"practice"};}
