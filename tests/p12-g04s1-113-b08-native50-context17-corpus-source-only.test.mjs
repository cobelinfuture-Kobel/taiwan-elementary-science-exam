import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const read=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const pre=read('p12-g04s1-113-other-dependent-b08-source-parent-preflight-v1.json');
const cross=read('p12-g04s1-113-b08-native50-original-bbox-id-crosswalk-v1.json');
const eval17=read('p12-g04s1-113-b08-context17-original-parent-science-kp-triage-v1.json');
const dedup=require('../scripts/review/p12-g04s1-113-b08-context17-original114-public-dedup-preflight.cjs');
const authority=JSON.parse(readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
const kp=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('B08 50 original school source response positions map to exact native PDF BBox without changing B01-B07',()=>{
 assert.equal(pre.summary.positions,50);
 assert.deepEqual([pre.summary.queue_start,pre.summary.queue_end],[351,400]);
 assert.equal(pre.records.length,50);assert.equal(cross.records.length,50);
 assert.deepEqual([cross.native_original_pdf_source_ID_and_answer_BBox_50_of_50,cross.original_pdf_SHA_checked_50],[50,50]);
 assert.equal(cross.source_PR124_DRAFT_unmerged,true);assert.equal(cross.prior_B01_B07_admissions_unchanged,true);
 assert.deepEqual(cross.formal_new,{FORMAL_SCIENCE_KP_APPROVED:0,ADMISSION_READY:0,PUBLISHED:0});
 assert.deepEqual(cross.triage_diagnostic_counts,{
  HOLD_REPORT_CONTEXT_OR_OPEN_ANSWER:5,HOLD_FIGURE_OR_ORDERED_CONTEXT:13,
  MATCHING_SCIENCE_KP_CANDIDATE_RENDERER_PENDING:10,HOLD_NONUNIQUE_LIGHT_CODEBANK:2,
  HOLD_MOON_KP_SCOPE:13,POTENTIAL_ORIGINAL_CONTEXT_MC7:7
 });
 const originalIds=new Set();
 for(let i=0;i<50;i++){
  const s=pre.records[i],x=cross.records[i];
  assert.equal(x.ordinal,351+i);assert.equal(s.other_lane_ordinal,x.ordinal);
  assert.equal(x.source_queue_alias,s.source_slot_id);assert.equal(x.paper_id,s.paper_id);
  assert.equal(x.pdf_sha256,s.original_pdf_sha256);
  assert.ok(!originalIds.has(x.original_school_source_slot_id));originalIds.add(x.original_school_source_slot_id);
  assert.ok(x.original_school_source_slot_id.startsWith(x.paper_id+'|'));
  assert.ok(x.pdf_page_1_based>=1&&x.pdf_page_1_based<=3);
  assert.equal(x.bbox_pdf_pts.length,4);
  assert.ok(x.bbox_pdf_pts[2]>x.bbox_pdf_pts[0]&&x.bbox_pdf_pts[3]>x.bbox_pdf_pts[1]);
  assert.equal(x.already_public_main_v20,false);
  assert.deepEqual([x.formal_science_kp,x.admission_ready,x.published],[false,false,false]);
 }
});
test('B08 exact 7 grouped MC + 10 original codebank matching remain proposals only; 33 frozen holds',()=>{
 assert.equal(eval17.frozen_source_positions,50);
 assert.deepEqual(eval17.highest_priority_original_MC_context_child_7,[387,388,389,390,391,392,393]);
 assert.deepEqual(eval17.secondary_matching_context_codebank_child_10,[362,363,364,365,366,367,394,395,396,397]);
 assert.equal(eval17.records.length,17);assert.equal(eval17.other_33_source_HOLD.length,33);
 assert.equal(new Set([...eval17.records.map(x=>x.ordinal),...eval17.other_33_source_HOLD]).size,50);
 assert.deepEqual(eval17.nonunique_matching_HOLD_2.map(x=>x.ordinal),[368,369]);
 assert.deepEqual([eval17.FORMAL_SCIENCE_KP_APPROVED_NEW,eval17.ADMISSION_READY_NEW,eval17.PUBLISHED_NEW],[0,0,0]);
 assert.equal(eval17.operator_exact_cohort_approved,false);
 assert.equal(eval17.SCHOOL_TEACHER_ANSWER_KEY_VERIFIED,false);
 assert.equal(eval17.parent_groups.CHENGGONG_S03_G04.source_layout_column_alignment_visually_accepted,false);
 const answers=new Map([[387,'①'],[388,'②'],[389,'③'],[390,'③'],[391,'②'],[392,'④'],[393,'①'],
  [362,'C'],[363,'B'],[364,'D'],[365,'A'],[366,'C'],[367,'B'],
  [394,'A'],[395,'B'],[396,'B'],[397,'A']]);
 for(const x of eval17.records){
  const src=cross.records.find(y=>y.ordinal===x.ordinal);
  assert.ok(src);
  assert.equal(x.source_original_school_id,src.original_school_source_slot_id);
  assert.equal(x.source_pdf_sha256,src.pdf_sha256);
  assert.equal(x.pdf_page_1based,src.pdf_page_1_based);
  assert.deepEqual(x.answer_bbox_pdf_pts,src.bbox_pdf_pts);
  assert.equal(x.science_model_answer_proposal_not_school_key,answers.get(x.ordinal));
  assert.ok(kp.has(x.direct_113_frozen48_kp_proposal));
  assert.equal(x.source_parent_exact_layout_or_source_rights_final_accepted,false);
  assert.equal(x.formal_scienceKP_approved,false);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
 }
});
test('B08 114/717 plus all current G04 public records lexical preflight never silently certifies duplicates or admission',()=>{
 const d=dedup.build();
 console.log('B08_CONTEXT17_LEXICAL_CORPUS_EVIDENCE '+JSON.stringify({
   original114:d.original_114_source_occurrences,publicG04:d.public_G04S1_records,
   candidateRows:d.original_B08_candidate_rows,highNearRows:d.detected_lexical_high_near_rows,
   hits:d.rows.filter(x=>x.lexical_hits_ge_078.length>0).map(x=>({ordinal:x.ordinal,matches:x.lexical_hits_ge_078}))
 }));
 assert.equal(d.original_114_source_occurrences,717);
 assert.ok(d.public_G04S1_records>=749);
 assert.equal(d.original_B08_candidate_rows,17);
 assert.equal(d.semantic_duplicate_certified,false);
 assert.equal(d.ADMISSION_READY_NEW,0);
 assert.equal(d.PUBLISHED_NEW,0);
 assert.equal(d.rows.length,17);
 assert.ok(d.rows.every(x=>x.operator_admission_ready===false&&x.all_original_options_and_parent_semantic_review_done===false));
 const originalIDs=new Set(eval17.records.map(x=>x.source_original_school_id));
 assert.ok(d.rows.every(x=>originalIDs.has(x.original_source_id)));
});
