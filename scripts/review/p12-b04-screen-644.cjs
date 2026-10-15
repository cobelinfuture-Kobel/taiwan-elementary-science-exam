#!/usr/bin/env node
// P12 B04: deterministic source screening. Never modifies the learner bank.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
const seen=new Set(), rows=[];
for(const file of index.current_public_source_archive_files){
 const data=read(file);
 for(const q of data.original_question_records){
  if(seen.has(q.source_id))throw Error('Duplicate source_id '+q.source_id);
  seen.add(q.source_id);
  const science=q.model_science_status==='MODEL_SCIENCE_PASS';
  const strongKP=q.kp_review_status==='KP_STRONG_CANDIDATE'&&!!q.canonical_kp_id_proposed;
  const optionsComplete=q.question_type==='TRUE_FALSE' || (q.question_type==='SINGLE_CHOICE'&&Array.isArray(q.options)&&q.options.length>=2&&q.options.every(o=>o.label&&o.text));
  const sourceComplete=!!q.stem?.trim()&&!!q.source_id&&Array.isArray(q.source_pdf_pages)&&q.source_pdf_pages.length>0&&optionsComplete;
  // Content-only projections intentionally contain no official answer, bbox or human release proof.
  // Absence of proof is a hold, not a negative science judgment.
  const reasons=[];
  if(!science)reasons.push('SCIENCE_REVIEW_HOLD');
  if(!strongKP)reasons.push('KP_REVIEW_HOLD');
  if(!sourceComplete)reasons.push('SOURCE_TEXT_OR_OPTIONS_HOLD');
  reasons.push('UNIQUE_ANSWER_EVIDENCE_REQUIRED','PDF_BBOX_DEPENDENCY_VERIFICATION_REQUIRED','RIGHTS_AND_OPERATOR_RELEASE_REQUIRED');
  rows.push({source_id:q.source_id,paper_id:data.paper_id,source_file:file,question_type:q.question_type,
   source_pdf_pages:q.source_pdf_pages,model_science_status:q.model_science_status,kp_review_status:q.kp_review_status,
   canonical_kp_id_proposed:q.canonical_kp_id_proposed||null,
   screening_lane:science&&strongKP&&sourceComplete?'PRIORITY_EXACT_REVIEW':'SEPARATE_HOLD',
   publish_approved:false,hold_reasons:reasons});
 }
}
const n=(fn)=>rows.filter(fn).length;
const report={
 schema_version:'P12_B04_644_SCIENCEPASS_FORMAL_ADMISSION_SCREENING_V1',
 source_index:'data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json',
 source_papers:index.current_public_source_archive_files.length,
 source_question_occurrences:rows.length,
 model_science_pass:n(r=>r.model_science_status==='MODEL_SCIENCE_PASS'),
 science_hold:n(r=>r.model_science_status!=='MODEL_SCIENCE_PASS'),
 strong_kp_candidates:n(r=>r.kp_review_status==='KP_STRONG_CANDIDATE'),
 priority_source_evidence_review:n(r=>r.screening_lane==='PRIORITY_EXACT_REVIEW'),
 separate_hold:n(r=>r.screening_lane==='SEPARATE_HOLD'),
 formal_new_approvals:0,new_student_bank_admissions:0,
 decision:'NO_AUTO_PUBLICATION_FROM_MODEL_STATES',
 required_final_evidence:['ORIGINAL_SOURCE_TEXT_AND_ALL_OPTIONS','PDF_PAGE_BBOX_AND_CONTEXT_DEPENDENCY','UNIQUE_CORRECT_ANSWER_WITH_EXPLANATION','CANONICAL_KP_VERIFIED','RIGHTS','OPERATOR_APPROVAL'],
 records:rows
};
if(report.source_papers!==25||report.source_question_occurrences!==717||report.model_science_pass!==644||report.science_hold!==73)throw Error('Frozen counts changed: '+JSON.stringify({papers:report.source_papers,total:report.source_question_occurrences,pass:report.model_science_pass,hold:report.science_hold}));
if(rows.some(r=>r.publish_approved))throw Error('Unexpected admission');
const out=process.argv[2];
if(out){fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({papers:report.source_papers,originals:report.source_question_occurrences,science_pass:report.model_science_pass,science_hold:report.science_hold,priority:report.priority_source_evidence_review,separate_hold:report.separate_hold,admitted:0}));
