#!/usr/bin/env node
'use strict';
// Existing DUPLICATE Gate evidence only. Lexical/near hits MUST NOT auto-admit
// or suppress a question without full original options and parent review.
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'../..');
const read=(p)=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const candidates=[
[302,'這次地震位於最大震度達到6強的民眾，地震發生時可能會感受或看見哪些現象？'],
[303,'根據本文，下列哪一個地區最靠近本次地震的震央？'],
[304,'這次地震的原因，主要是下列哪兩個板塊的擠壓造成的？'],
[305,'根據本文，布袋蓮是哪一種水生植物？'],
[306,'布袋蓮的氣室可以幫助葉片漂浮，與下列哪一種水生植物的構造類似？'],
[307,'上圖中，膨大的部分裡面有'],
[311,'可以幫助魚在水中游水'],
[312,'讓魚可以呼吸'],[313,'保護魚的身體'],
[314,'橋梁斷裂'],[315,'鐵軌扭曲'],[316,'水壩破裂'],
[317,'空氣汙染'],[318,'淹水'],[319,'物品散落'],
[320,'震源在地表的投影，是最靠近震源的地點。'],
[328,'5. 請將下面不同環境和對應的保護方法連起來。(1)山坡地裸露 A.整治河川 B.在裸露的山坡地種植植物 C.避免砍伐森林，維持森林生態的完整性。'],
[329,'5. 請將下面不同環境和對應的保護方法連起來。(2)砍伐森林 A.整治河川 B.在裸露的山坡地種植植物 C.避免砍伐森林，維持森林生態的完整性。'],
[330,'5. 請將下面不同環境和對應的保護方法連起來。(3)開挖砂石 A.整治河川 B.在裸露的山坡地種植植物 C.避免砍伐森林，維持森林生態的完整性。'],

[321,'引發地震的位置'],
[322,'該次地震震源所釋放出的能量大小，目前世界通用的為芮氏規模。'],
[323,'人體感受地面搖動、建築物受破壞的程度。'],
[324,'魚的鰓位於身體的哪一個部位呢？'],
[325,'下列哪一種動物的呼吸方式和其他三者不一樣？'],
[326,'在蝌蚪變成蛙的過程中，從來沒有使用下列哪一種構造呼吸呢？'],
[327,'浮潛使用的呼吸管，和下列哪一種動物的呼吸構造相似？'],
[331,'地震時，住在宜蘭的阿美比較可能觀察到什麼現象？'],
[332,'震央位於哪一個縣市？'],
[333,'這次的地震深度是多少公里？'],
[334,'地震發生時，小婷感覺明顯搖晃，房屋震動，他可能住在哪一個縣市？'],
[335,'玉黍螺適合在哪一種環境生存？'],
[336,'下列哪一種生物會利用羽毛狀的觸手捕食？'],
[337,'哪一種環境在海水中的時間最長，有許多不能承受乾燥與高溫的生物生存？']
];
const N=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/[\s\r\n、，,。．.！!？?；;：（）()「」『』％%\-—_]/g,'');
function dice(a,b){
 if(a===b)return 1;if(a.length<2||b.length<2)return 0;
 const m=new Map();for(let i=0;i<a.length-1;i++){const z=a.slice(i,i+2);m.set(z,(m.get(z)||0)+1)}
 let hit=0;for(let i=0;i<b.length-1;i++){const z=b.slice(i,i+2),v=m.get(z)||0;if(v){hit++;m.set(z,v-1)}}
 return 2*hit/(a.length+b.length-2);
}
function build(){
 const ledger=read('data/review/p12-g04s1-113-b07-dependent50-originalpdf-ninepages-nativebbox-science-kp-hold-v1.json');
 const indexed=new Set(ledger.records.map(x=>x.worklist_ordinal));
 if(ledger.records.length!==50||candidates.some(([n])=>!indexed.has(n)))throw Error('B07 source evidence coverage changed');
 const archiveIndex=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
 if(archiveIndex.current_public_source_archive_files.length!==25)throw Error('114 corpus not 25 schools');
 const original114=archiveIndex.current_public_source_archive_files.flatMap(file=>{
  const d=read(file);return (d.original_question_records||[]).map(x=>({corpus:'114_ORIGINAL_SOURCE',file,id:x.source_id,stem:x.stem||'',options:x.options||[]}));
 });
 if(original114.length!==717)throw Error('114 frozen 717 source question occurrences changed');
 const dirname=path.join(ROOT,'site/data/question-bank');
 const publicFiles=fs.readdirSync(dirname).filter(f=>f.endsWith('.json'));
 const publicG04=publicFiles.flatMap(name=>{
  const d=read('site/data/question-bank/'+name);
  return (d.blocks||[]).filter(x=>x.grade===4&&x.semester===1&&typeof x.stem==='string').map(x=>({
   corpus:'PUBLIC_G04S1_BANK_MODULE',file:'site/data/question-bank/'+name,id:x.source_slot_id||x.source_original_slot_id||x.id,stem:x.stem,options:x.options||[]
  }));
 });
 const compare=[...original114,...publicG04].filter(x=>x.stem.length>0);
 const rows=candidates.map(([ordinal,schoolQuestionExcerpt])=>{
  const s=N(schoolQuestionExcerpt);const excerptOnly=s.length<10;
  const ranked=compare.map(x=>({item:x,score:dice(s,N(x.stem))})).sort((a,b)=>b.score-a.score);
  const hits=ranked.filter(x=>x.score>=0.78).slice(0,5).map(x=>({
   source_id:x.item.id,source_corpus:x.item.corpus,source_file:x.item.file,stem_similarity:+x.score.toFixed(4),match_type:x.score===1?'EXACT_NORMALIZED_STEM':'NEAR_STEM_REVIEW',
   full_question_and_options_accepted_duplicate:false}));
  return {ordinal,source_question_text_excerpt_only:schoolQuestionExcerpt,short_excerpt_not_safe_for_dedup:excerptOnly,
   exact_or_high_near_stem_hits:hits,
   full_113_114_question_options_parent_semantic_duplicate_review_status:'INCOMPLETE_EXISTING_DUPLICATE_GATE',
   student_admission_allowed:false};
 });
 return {
  schema_version:'P12_G04S1_113_B07_33_QUESTION_EXCERPT_LEXICAL_DEDUP_PREFLIGHT_V2',
  comparison_114_original_positions:original114.length,
  comparison_public_g04s1_module_rows:publicG04.length,
  comparison_student_bank_files:publicFiles.length,
  candidate_excerpt_rows:rows.length,
  semantic_duplicate_certified:false,
  note:'Original school text excerpts for search, including G05 synthetic child+unchanged codebank concatenation without rewriting any original question; short individual label matches are not semantic dedup; the complete original question, parent story, all ordered options, graphics and crossschool semantics must be reviewed under existing Gate. This is NOT a duplicate acceptance/rejection or operator cohort.',
  exact_or_near_rows:rows.filter(x=>x.exact_or_high_near_stem_hits.length).length,
  rows,
  FORMAL_SCIENCE_KP_APPROVED_NEW:0,
  ADMISSION_READY_NEW:0,
  PUBLISHED_NEW:0
 };
}
if(require.main===module){const d=build();const arg=process.argv.find(x=>x.startsWith('--out='));if(arg)fs.writeFileSync(path.resolve(ROOT,arg.slice(6)),JSON.stringify(d,null,2)+'\n');console.log(JSON.stringify({source114:d.comparison_114_original_positions,publicRows:d.comparison_public_g04s1_module_rows,candidates:d.candidate_excerpt_rows,possibleNear:d.exact_or_near_rows,hits:d.rows.filter(x=>x.exact_or_high_near_stem_hits.length).map(x=>({ordinal:x.ordinal,hits:x.exact_or_high_near_stem_hits}))},null,2))}
module.exports={build,N,dice,candidates};
