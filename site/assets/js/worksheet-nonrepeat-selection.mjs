// Subset-sum over complete question blocks; prevents printing two copies of
// the same tested fact in one generated paper without hiding either source slot.
export function chooseExactBlocks(blocks,requested){
 if(!Number.isInteger(requested)||requested<0)throw Error("作答題數不正確");
 const groupOf=b=>b.same_worksheet_exclusion_policy==="MUTUALLY_EXCLUSIVE"?b.same_worksheet_exclusion_group??null:null;
 const sizeOf=b=>b.type==="group"?b.items.length:1;
 const states=new Map([["0|",{count:0,groups:[],chosen:[]}]]);
 for(const b of blocks){
  const group=groupOf(b),size=sizeOf(b);
  if(!Number.isInteger(size)||size<1)throw Error("題組作答位置缺漏："+b.id);
  const current=[...states.values()].sort((a,z)=>z.count-a.count);
  for(const entry of current){
   if(group&&entry.groups.includes(group))continue;
   const n=entry.count+size;
   if(n>requested)continue;
   const groups=group?[...entry.groups,group].sort():entry.groups;
   const key=n+"|"+groups.join(",");
   if(!states.has(key))states.set(key,{count:n,groups,chosen:[...entry.chosen,b]});
  }
 }
 return [...states.values()].find(x=>x.count===requested)?.chosen??null;
}
