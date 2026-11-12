#!/usr/bin/env node
'use strict';
// This is a supplementary evidence lookup for the EXISTING DUPLICATE Gate.
// It neither authorizes any source-rights use nor certifies a new student question.
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'../..');
const R=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const target=R('data/review/p12-g04s1-113-b07-lushang-g02-g04-native-visual-parent-science-rights-v1.json');
const index=R('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
function n(s){return String(s??'').normalize('NFKC').replace(/[\s\r\n，,。．.？?！!：「」『』、()（）①②③④]/g,'').toLowerCase()}
function dice(a,b){
 if(!a||!b)return 0;if(a===b)return 1;
 const m=new Map();for(let i=0;i<a.length-1;i++){const z=a.slice(i,i+2);m.set(z,(m.get(z)||0)+1)}
 let common=0;for(let i=0;i<b.length-1;i++){const z=b.slice(i,i+2);const c=m.get(z)||0;if(c){common++;m.set(z,c-1)}}
 return 2*common/Math.max(1,a.length+b.length-2);
}
function normalizedOptions(raw){
 let a=Array.isArray(raw)?raw:[];
 return a.map(v=>n(typeof v==='string'?v:(v?.text??v?.label??'')));
}
function source(){
 const original114=index.current_public_source_archive_files.flatMap(file=>{
  let d=R(file);
  return (d.original_question_records??[]).map(q=>({file,kind:'114_ORIGINAL_SOURCE',id:q.source_id,stem:q.stem,choices:q.options??[]}));
 });
 const directory=path.join(ROOT,'site/data/question-bank');
 const files=fs.readdirSync(directory).filter(f=>f.endsWith('.json'));
 let publicRows=[];
 for(const file of files){
  let d=R('site/data/question-bank/'+file);
  for(const x of d.blocks??[]){
   if(x.grade===4&&x.semester===1&&typeof x.stem==='string')publicRows.push({
    file:'site/data/question-bank/'+file,kind:'PUBLIC_G04S1_BANK',id:x.source_slot_id??x.source_original_slot_id??x.id,stem:x.stem,choices:x.options??[]
   });
  }
 }
 if(index.current_public_source_archive_files.length!==25||original114.length!==717)throw Error('114 source archive not 25/717');
 if(target.g04_text_mc_4.length!==4)throw Error('B07 G04 original cohort changed');
 return {original114,publicRows,files};
}
function build(){
 const {original114,publicRows,files}=source();
 const cases=target.g04_text_mc_4.map(t=>{
  let text=n(t.original_stem),options=normalizedOptions(t.original_ordered_options);
  const scored=[...original114,...publicRows].filter(x=>x.stem).map(x=>{
   let s=n(x.stem),os=normalizedOptions(x.choices);
   let stemScore=dice(text,s);
   let optionMatch=os.length===4&&options.length===4&&os.slice().sort().join('\u001f')===options.slice().sort().join('\u001f');
   let exactStem=text===s;
   return {corpus:x.kind,id:x.id,file:x.file,stemScore:+stemScore.toFixed(5),exactStem,optionOrderInvariantMatch:optionMatch,
     fullSameQuestionConfirmed:exactStem&&optionMatch}
  }).sort((a,b)=>b.stemScore-a.stemScore);
  return {original_ordinal:t.ordinal,original_source_id:t.source_native_id,
   exactStemCandidates:scored.filter(x=>x.exactStem).slice(0,10),
   confirmedExactOrOptionReorder:scored.filter(x=>x.fullSameQuestionConfirmed),
   nearStemReview:scored.filter(x=>x.stemScore>=0.62&&!x.exactStem).slice(0,5),
   source_only_no_operator_signoff:true};
 });
 return {
  schema_version:'P12_113_G04S1_B07_G04_FOURMC_FULL_STEM_OPTIONS_114717_PUBLIC_BANK_SEMANTIC_PRECHECK_V1',
  formal_duplicate_gate_complete:false,
  scope:'Lookups across 114 25 original corpus 717 questions and installed G04S1 bank modules. 113 24 original native PDFs screened separately by authenticated Google Drive original text; five 113 scans retain targeted visual semantics and rights gates.',
  compared_original114_questions:original114.length,
  compared_public_modules:files.length,
  compared_public_g04s1_rows:publicRows.length,
  candidate_count:cases.length,
  exact_confirmed_question_duplicates:cases.reduce((a,x)=>a+x.confirmedExactOrOptionReorder.length,0),
  candidate_rows:cases,
  admission_ready_new:0,published_new:0
 };
}
if(require.main===module)console.log('B07_G04_FULL_OPTIONS_DUP_REPORT='+JSON.stringify(build()));
module.exports={build};
