#!/usr/bin/env node
'use strict';
// B08 DUPLICATE GATE evidence only: lexical proximity is not a formal operator admission.
// Compare all 114/717 school original source occurrences and current public G04S1 modules.
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const N=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/[\\s\\r\\n、，,。．.！!？?；;：（）()「」『』％%\\-—_①②③④○１２３４]/g,'');
function dice(a,b) {
 if(a===b)return 1;if(a.length<2||b.length<2)return 0;
 const m=new Map();for(let i=0;i<a.length-1;i++){const v=a.slice(i,i+2);m.set(v,(m.get(v)||0)+1)}
 let same=0;for(let i=0;i<b.length-1;i++){const v=b.slice(i,i+2),n=m.get(v)||0;if(n){same++;m.set(v,n-1)}}
 return 2*same/(a.length+b.length-2);
}
function build(){
 const cand=read('data/review/p12-g04s1-113-b08-context17-original-parent-science-kp-triage-v1.json');
 const source=read('data/review/p12-g04s1-113-b08-native50-original-bbox-id-crosswalk-v1.json');
 const index=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
 if(cand.records.length!==17||source.records.length!==50||index.current_public_source_archive_files.length!==25)throw Error('B08 admission source corpus conservation');
 const original=index.current_public_source_archive_files.flatMap(file=>(read(file).original_question_records||[]).map(q=>({
  source_id:q.source_id,stem:q.stem||'',options:q.options||[],file,corpus:'114_ORIGINAL'
 })));
 if(original.length!==717)throw Error('114 corpus 717 changed');
 const directory='site/data/question-bank';
 const files=fs.readdirSync(path.join(ROOT,directory)).filter(x=>x.endsWith('.json'));
 const publicRows=files.flatMap(file=>(read(directory+'/'+file).blocks||[])
  .filter(q=>q.grade===4&&q.semester===1&&typeof q.stem==='string')
  .map(q=>({source_id:q.source_original_slot_id||q.source_slot_id||q.id,
   stem:q.stem,options:q.options||[],file:directory+'/'+file,corpus:'LIVE_MAIN_PUBLIC_G04S1'})));
 if(publicRows.length<749)throw Error('current public bank below source-certified baseline');
 const compare=[...original,...publicRows];
 const rows=cand.records.map(q=>{
  const normalizedStem=N(q.source_child_text_original_visible);
  const ranked=compare.map(item=>({item,score:dice(normalizedStem,N(item.stem))}))
   .sort((a,b)=>b.score-a.score);
  const hits=ranked.filter(x=>x.score>=0.78).slice(0,5).map(x=>({
   source_id:x.item.source_id,corpus:x.item.corpus,source_file:x.item.file,
   stem_similarity:+x.score.toFixed(4),exact_stem:x.score===1,
   same_actual_parent_or_reordered_option_duplicate_certified:false
  }));
  return {ordinal:q.ordinal,original_source_id:q.source_original_school_id,
   original_context_group:q.source_parent_group,question_excerpt:q.source_child_text_original_visible,
   source_prompt_short_or_dependent_normalized_len:normalizedStem.length,
   lexical_hits_ge_078:hits,all_original_options_and_parent_semantic_review_done:false,
   operator_admission_ready:false};
 });
 return {schema_version:'P12_G04S1_113_B08_CONTEXT17_114717_PUBLIC_LEXICAL_PREFLIGHT_V1',
  114_original_source_occurrences:original.length,public_G04S1_records:publicRows.length,
  student_bank_module_file_count:files.length,original_B08_candidate_rows:rows.length,
  detected_lexical_high_near_rows:rows.filter(x=>x.lexical_hits_ge_078.length).length,
  scope_limits:'Short source excerpt is NOT the original independent question without shared codebank or speaker/table context. No semantic duplicate certification by lexical score.',
  semantic_duplicate_certified:false,FORMAL_SCIENCE_KP_APPROVED_NEW:0,ADMISSION_READY_NEW:0,PUBLISHED_NEW:0,rows};
}
if(require.main===module){const d=build();console.log('B08_DUPLICATE_PREFLIGHT_SUMMARY '+JSON.stringify({
 original114:d['114_original_source_occurrences'],publicG04:d.public_G04S1_records,
 candidates:d.original_B08_candidate_rows,highNearRows:d.detected_lexical_high_near_rows,
 hits:d.rows.filter(x=>x.lexical_hits_ge_078.length).map(x=>({ordinal:x.ordinal,near:x.lexical_hits_ge_078}))
 }))}
module.exports={build,N,dice};
