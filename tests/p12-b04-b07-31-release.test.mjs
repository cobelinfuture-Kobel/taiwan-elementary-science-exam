import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B07_31} from "../site/assets/js/p12-b04-b07-31-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b07-31-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b07-first50-science-kp-review-v1.json");
const proof=read("data/review/p12-b04-b07-31-formal-science-kp-acceptance-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/g,"");
const noScore=s=>String(s??"").replace(/[（(]\s*\d+\s*分\s*[）)]/gu,"");
test("B07 strict 31 Source/Science/KP original evidence, 25 TF+6 MC; 19 scan HOLD and 15 scoreless source parents",()=>{
 const validated=validateAndConvertP12B04B07_31(bank,authority);
 assert.deepEqual([validated.answerSlots,validated.standaloneTf,validated.standaloneChoice],[31,25,6]);
 assert.deepEqual([proof.approved_items.length,proof.held_items.length],[31,19]);
 assert.deepEqual([proof.scoreless_admitted_source_count,proof.original_parent_score_review_count],[15,15]);
 assert.equal(review.ready_for_formal_gate,31);
 assert.equal(review.source_or_semantic_hold,19);
 const archiveMap=new Map(),pr=new Map(proof.approved_items.map(x=>[x.source_slot_id,x]));
 let scorelessCount=0,tf=0,mc=0;
 for(const b of bank.blocks){
  const p=pr.get(b.source_slot_id),r=review.records.find(x=>x.source_id===b.source_slot_id);
  assert.ok(p&&r&&!r.exception_flags.length);
  if(!archiveMap.has(p.original_source_archive_ref))archiveMap.set(p.original_source_archive_ref,read(p.original_source_archive_ref));
  const file=archiveMap.get(p.original_source_archive_ref);
  const source=file.original_question_records.find(q=>q.source_id===b.source_slot_id);
  assert.ok(source);
  assert.equal(source.full_original_stem,p.full_original_stem_exact);
  assert.equal(norm(noScore(source.full_original_stem)),norm(b.stem));
  assert.deepEqual(source.full_original_options_in_order.map(x=>x.label+x.text),b.options??[]);
  assert.deepEqual(source.answer_marker_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(file.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(file.license_status,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(file.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
  assert.equal(source.article9_exam_question_text_only,true);
  assert.equal(source.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(b.answer,p.science_unique_answer);
  assert.equal(b.answer_explanation,p.independent_science_reasoning);
  assert.equal(b.canonical_kp_id,p.KP);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  if(r.source_parent_score_annotation_removed_for_student_view){
   scorelessCount++;assert.equal(p.parent_score_instruction_original,source.full_original_stem);
  }else assert.equal(p.parent_score_instruction_original,null);
  if(b.type==="tf")tf++;else if(b.type==="mcq")mc++;else assert.fail("unexpected type");
 }
 assert.deepEqual([scorelessCount,tf,mc],[15,25,6]);
 assert.equal(archiveMap.size,2);
 assert.ok(proof.held_items.every(x=>x.site_admitted===false));
});
test("B07 fails closed on tampering with answer/KP/stem/choice/PDF source/BBox/rights/approval",()=>{
 const changes=[
  b=>b.blocks[0].answer="X",
  b=>b.blocks[0].canonical_kp_id="sci_g04s1_04_01",
  b=>b.blocks[0].stem="tampered",
  b=>b.blocks.find(x=>x.type==="mcq").options[0]="①tampered",
  b=>b.blocks[0].source_pdf_sha256="x",
  b=>b.blocks[0].source_pdf_bbox_pts_top_left=null,
  b=>b.blocks[0].source_page_pdf_1_based=99,
  b=>b.blocks[0].answer_explanation="tampered",
  b=>b.blocks[0].source_slot_id="UNKNOWN",
  b=>b.blocks[0].operator_publication_approval=false,
  b=>b.blocks[0].copyright_path="UNKNOWN"
 ];
 for(const edit of changes){const value=structuredClone(bank);edit(value);assert.throws(()=>validateAndConvertP12B04B07_31(value,authority));}
});
