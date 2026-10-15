#!/usr/bin/env node
'use strict';
/**
 * P12 B04: stable 409/9 source-slot review batches.
 * This is a preflight and evidence triage, never an automatic science verdict
 * or public-bank writer. Operator's bulk authorization permits admission only
 * after exact evidence, unique answer, KP and rights have passed independently.
 */
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const has=p=>fs.existsSync(path.join(ROOT,p));
const assert=(condition,msg)=>{if(!condition)throw Error('P12_B04_AUTO_BATCH50_CONTRACT: '+msg);};
const norm=x=>String(x??'').replace(/\s+/gu,'').normalize('NFKC');
const normStem=x=>norm(x).replace(/[。．！？!?，,、；;：:「」『』（）()]/gu,'');
const sourceIndex='data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json';
const index=read(sourceIndex);
const authority=read('site/data/authority/science-g03-g04-selector-v2.json');
const knownKP=new Map(authority.units.flatMap(u=>u.knowledge_points.map(k=>[k.canonical_kp_id,{grade:u.grade,semester:u.semester,unit:u.unit_id,title:k.title}])));
const releasedPaths=[
 'site/data/question-bank/p12-b04-g04s1-yongan-mid9-public-v1.json',
 'site/data/question-bank/p12-b04-g04s1-chongde-mid6-public-v1.json'
];
const releaseRecords=releasedPaths.flatMap(file=>read(file).blocks);
const released=new Set(releaseRecords.map(x=>x.source_slot_id));
assert(released.size===15&&releaseRecords.length===15,'must preserve exact 15 unique admitted source IDs');
const dupLedger=read('data/review/p12-b04-chongde-mid6-science-kp-source-acceptance-v1.json');
const previouslyReviewedDuplicates=new Set(dupLedger.duplicate_not_published.map(x=>x.source_slot_id));
assert(previouslyReviewedDuplicates.size===1,'one historical cross-school duplicate must remain archived');
for(const id of released)assert(!previouslyReviewedDuplicates.has(id),'published and duplicate source overlap');
const consumed=new Set([...released,...previouslyReviewedDuplicates]);
assert(consumed.size===16,'prior reviewed source census drift');
const seen=new Set(),all=[],candidates=[],byStem=new Map();
for (const p of index.current_public_source_archive_files) {
 const file=read(p),origPath=file.original_source_archive_ref;
 const raw=origPath&&has(origPath)?read(origPath):null;
 const rawMap=new Map((raw?.original_question_records??[]).map(r=>[r.source_id,r]));
 assert(Array.isArray(file.original_question_records)&&file.paper_id,'invalid active source file '+p);
 for (const [i,q] of file.original_question_records.entries()) {
  assert(q.source_id&&!seen.has(q.source_id),'repeated or empty source ID '+q.source_id);
  seen.add(q.source_id);
  const isPriority=q.model_science_status==='MODEL_SCIENCE_PASS'
   &&q.kp_review_status==='KP_STRONG_CANDIDATE'
   &&!!q.canonical_kp_id_proposed
   &&!!q.stem?.trim()
   &&(q.question_type==='TRUE_FALSE'||q.question_type==='SINGLE_CHOICE')
   &&(q.question_type!=='SINGLE_CHOICE'||(q.options?.length>=2&&q.options.every(o=>o.label&&o.text)))
   &&Array.isArray(q.source_pdf_pages)&&q.source_pdf_pages.length>0;
  all.push({id:q.source_id,priority:isPriority,science:q.model_science_status});
  if (!isPriority)continue;
  const orig=rawMap.get(q.source_id);
  const expectedStem=orig?.full_original_stem??orig?.original_item_stem??null;
  const expectedOptions=orig?.full_original_options_in_order??[];
  const choicesExact=Array.isArray(expectedOptions)
   &&JSON.stringify(expectedOptions.map(o=>[norm(o.label),norm(o.text)]))
     ===JSON.stringify((q.options??[]).map(o=>[norm(o.label),norm(o.text)]));
  const stemExact=!!expectedStem&&norm(expectedStem)===norm(q.stem);
  const bbox=orig?.answer_marker_pdf_bbox_pts_top_left;
  const bboxValid=Array.isArray(bbox)&&bbox.length===4&&bbox.every(Number.isFinite)
    &&bbox[0]<bbox[2]&&bbox[1]<bbox[3];
  const pageValid=!!orig&&(q.source_pdf_pages.includes(orig.source_pdf_page)||q.source_pdf_pages.includes(orig.answer_marker_pdf_page)||q.source_pdf_pages.includes(orig.source_pdf_pages?.[0]));
  const rights=raw?.license_status==='REGULATED_EXAM_QUESTION_ART9'
   &&raw.regulated_exam_identity_verified===true
   &&raw.third_party_content_clearance==='NO_THIRD_PARTY_COPY'
   &&orig?.article9_exam_question_text_only===true
   &&['NONE_IDENTIFIED_TEXT_ONLY',undefined].includes(orig?.third_party_content_in_this_item);
  const kp=knownKP.get(q.canonical_kp_id_proposed);
  const kpExists=kp?.grade===4&&kp?.semester===1;
  const standalone=orig?.standalone_without_shared_figure_or_stimulus===true;
  const same=byStem.get(normStem(q.stem));
  const duplicatePublished=releaseRecords.find(x=>normStem(x.stem)===normStem(q.stem));
  const flags=[];
  if (!orig)flags.push('ARCHIVED_ORIGINAL_RECORD_MISSING');
  if (!stemExact||!choicesExact)flags.push('EXACT_STEM_OPTIONS_NOT_CONFIRMED');
  if (!bboxValid||!pageValid)flags.push('PDF_PAGE_OR_ANSWER_MARKER_BBOX_REVIEW');
  if (!standalone)flags.push('PARENT_FIGURE_CONTEXT_DEPENDENCY_REVIEW');
  if (!rights)flags.push('RIGHTS_EVIDENCE_REVIEW');
  if (!kpExists)flags.push('CANONICAL_KP_AUTHORITY_REVIEW');
  if(q.question_type==='SINGLE_CHOICE' && new Set((q.options??[]).map(o=>o.label)).size!==(q.options??[]).length)
   flags.push('PRINTED_DUPLICATE_CHOICE_LABEL_HOLD');
  if (duplicatePublished)flags.push('EXACT_STEM_ALREADY_IN_PUBLIC_BANK');
  if (same&&!duplicatePublished)flags.push('CROSS_SOURCE_SAME_STEM_REVIEW');
  // A model PASS and a KP proposal cannot supply an independently certified answer.
  flags.push('SCIENCE_UNIQUE_ANSWER_EVIDENCE_REQUIRED','CANONICAL_KP_SEMANTIC_APPROVAL_REQUIRED');
  const entry={
   source_id:q.source_id,paper_id:file.paper_id,source_content_ref:p,original_source_ref:origPath,
   question_order_in_paper:i+1,question_number:q.question_number,question_type:q.question_type,
   full_original_stem:q.stem,original_options_in_order:q.options??[],
   source_pdf_pages:q.source_pdf_pages,original_answer_marker_bbox_pts_top_left:bboxValid?bbox:null,
   proposed_kp_id:q.canonical_kp_id_proposed,proposed_kp_title:kp?.title??null,
   archived_original_stem_options_exact:stemExact&&choicesExact,independent_single_question:standalone,
   original_pdf_page_bbox_recorded:bboxValid&&pageValid,
   exam_question_text_rights_evidence:!!rights,
   same_stem_prior_source:same??duplicatePublished?.source_slot_id??null,
   review_state:flags.some(x=>/MISSING|NOT_CONFIRMED|PDF_PAGE|DEPENDENCY|RIGHTS|AUTHORITY|ALREADY|CROSS_SOURCE|DUPLICATE_CHOICE/.test(x))?
     'SOURCE_OR_DUPLICATE_HOLD':'EXACT_SOURCE_READY_FOR_INDEPENDENT_SCIENCE_KP_REVIEW',
   release_allowed:false,exception_flags:flags
  };
  byStem.set(normStem(q.stem),same??q.source_id);
  candidates.push(entry);
 }
}
assert(index.current_public_source_archive_files.length===25,'source paper count');
assert(all.length===717&&all.filter(x=>x.science==='MODEL_SCIENCE_PASS').length===644,'frozen original/science totals');
assert(candidates.length===425,'initial priority census drift '+candidates.length);
for(const id of consumed)assert(candidates.some(x=>x.source_id===id),'previously reviewed source absent from frozen priority '+id);
const pending=candidates.filter(x=>!consumed.has(x.source_id));
assert(pending.length===409&&new Set(pending.map(x=>x.source_id)).size===409,'pending 409 source IDs not unique');
const batches=Array.from({length:9},(_,i)=>{
 const rows=pending.slice(i*50,(i+1)*50);
 assert(rows.length===(i===8?9:50),'batch partition '+(i+1));
 return {
  schema_version:'P12_B04_AUTO_BATCH50_V1',
  batch_id:'B'+String(i+1).padStart(2,'0'),
  batch_index:i+1,
  source_count:rows.length,
  source_first_id:rows[0].source_id,
  source_last_id:rows.at(-1).source_id,
  source_exact_preflight_ready:rows.filter(x=>x.review_state==='EXACT_SOURCE_READY_FOR_INDEPENDENT_SCIENCE_KP_REVIEW').length,
  source_or_duplicate_hold:rows.filter(x=>x.review_state==='SOURCE_OR_DUPLICATE_HOLD').length,
  publication_allowed_count:0,
  mode:'CONTRACT_ONLY_NOT_SCIENCE_AUTOCERTIFICATION',
  records:rows
 };
});
const counts={source_papers:25,original_source_occurrences:717,model_science_pass:644,original_priority_eligible:425,previously_accepted:15,previously_deduplicated:1,previously_reviewed:16,pending:409,batches:9,batch_sizes:batches.map(x=>x.source_count),other_science_pass:219,science_hold:73,autopublished:0};
const manifest={
 schema_version:'P12_B04_AUTO_BATCH50_NINE_BATCH_PLAN_V1',
 source_index:sourceIndex,
 approved_previous_release_refs:releasedPaths,
 duplicate_archive_ref:'data/review/p12-b04-chongde-mid6-science-kp-source-acceptance-v1.json',
 ordering:'FROZEN_25_SOURCE_FILE_ORDER_THEN_ORIGINAL_QUESTION_RECORD_ORDER',
 previous_review_source_ids:[...consumed].sort(),
 counts,
 batch_descriptors:batches.map(({records,...x})=>({...x,source_ids:records.map(r=>r.source_id)})),
 release_rule:'ONLY_WITH_EXACT_SOURCE_UNIQUE_SCIENCE_ANSWER_KP_RIGHTS_DEPENDENCIES_AND_OPERATOR_BULK_AUTHORIZATION',
 operator_exceptions_only:['AMBIGUOUS_UNIQUE_ANSWER','UNSUPPORTED_KP','INCOMPLETE_PDF_OR_FIGURE','THIRD_PARTY_RIGHTS','AUTHORITY_CHANGE'],
 exclusions_do_not_block_other_batches:true,
 no_background_publishing_without_independent_proofs:true
};
const arg=process.argv.find(x=>x.startsWith('--batch='));
const batchOnly=arg?Number(arg.split('=')[1]):null;
assert(batchOnly===null||(Number.isInteger(batchOnly)&&batchOnly>=1&&batchOnly<=9),'batch must be 1-9');
const outArg=process.argv.find(x=>x.startsWith('--out-dir='));
if(outArg){
 const output=path.resolve(outArg.slice('--out-dir='.length));
 fs.mkdirSync(output,{recursive:true});
 fs.writeFileSync(path.join(output,'manifest-v1.json'),JSON.stringify(manifest,null,2)+'\n');
 for(const b of batches){
  if(batchOnly===null||b.batch_index===batchOnly){
   fs.writeFileSync(path.join(output,'batch-'+String(b.batch_index).padStart(2,'0')+'-v1.json'),JSON.stringify(b,null,2)+'\n');
  }
 }
}
console.log('P12_B04_AUTO_BATCH50_PREFLIGHT_PASS '+JSON.stringify({
 ...counts,selected_batch:batchOnly,
 source_exact_ready:batches.reduce((n,b)=>n+b.source_exact_preflight_ready,0),
 source_or_duplicate_hold:batches.reduce((n,b)=>n+b.source_or_duplicate_hold,0)
}));
