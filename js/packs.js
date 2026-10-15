// Standard packs: validation and on-device storage. No network calls; uploaded packs live only in localStorage.
export const PACKS_KEY='faultline-packs';
const isStr=v=>typeof v==='string'&&v.trim()!=='';
export function validatePack(p,takenIds=[]){
 const e=[];
 if(!p||typeof p!=='object'||Array.isArray(p))return ['The file must be one JSON object that starts with { and ends with }.'];
 for(const f of ['id','code','title','text','grade'])if(!isStr(p[f]))e.push(`Missing field "${f}": it must be some text.`);
 if(isStr(p.id)&&takenIds.includes(p.id))e.push(`A pack with id "${p.id}" is already loaded. Remove it first or give this pack a different id.`);
 const mis=p.misconceptions;
 if(!mis||typeof mis!=='object'||Array.isArray(mis))e.push('Missing "misconceptions": it must be an object like {"tag": "feedback text"}.');
 else for(const [t,v] of Object.entries(mis))if(!isStr(v))e.push(`Misconception "${t}" needs feedback text.`);
 if(!Array.isArray(p.items)||!p.items.length){e.push('Missing "items": it must be a list with at least one question.');return e;}
 const seen=new Set();
 p.items.forEach((it,n)=>{const where=`Question ${n+1}${it&&isStr(it.id)?` (id "${it.id}")`:''}`;
  if(!it||typeof it!=='object'){e.push(`${where} is not an object.`);return;}
  if(!isStr(it.id))e.push(`${where} is missing an "id".`);
  else if(seen.has(it.id))e.push(`${where}: the id "${it.id}" is used more than once. Every question needs its own id.`);else seen.add(it.id);
  if(!isStr(it.q))e.push(`${where} is missing the question text "q".`);
  if(!Array.isArray(it.c)||it.c.length<2){e.push(`${where} needs a "c" list with at least 2 answer choices.`);return;}
  let correct=0;
  it.c.forEach((ch,k)=>{if(!Array.isArray(ch)||ch.length!==2||!isStr(ch[0])){e.push(`${where}, choice ${k+1} must look like ["answer text", "tag"] or ["answer text", null].`);return;}
   if(ch[1]===null)correct++;
   else if(!isStr(ch[1]))e.push(`${where}, choice ${k+1}: the tag must be text or null.`);
   else if(mis&&typeof mis==='object'&&!Object.hasOwn(mis,ch[1]))e.push(`${where}, choice ${k+1} uses the tag "${ch[1]}", but there is no "${ch[1]}" in "misconceptions".`);});
  if(correct===0)e.push(`${where} has no correct answer. Mark exactly one choice with null.`);
  if(correct>1)e.push(`${where} has ${correct} correct answers. Mark exactly one choice with null.`);});
 return e;}
export const loadUploaded=()=>{try{const a=JSON.parse(localStorage.getItem(PACKS_KEY));return Array.isArray(a)?a.filter(p=>!validatePack(p).length):[]}catch{return[]}};
export const saveUploaded=a=>localStorage.setItem(PACKS_KEY,JSON.stringify(a));
