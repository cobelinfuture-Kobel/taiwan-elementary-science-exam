import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=x=>JSON.parse(readFileSync(x,"utf8"));
const p="data/review/p12-g04s1-114-";
const v16=read(p+"all25-kp-first-progress-v16.json");
const v17=read(p+"all25-kp-first-progress-v17.json");
const batch=read(p+"last11-source-position-inventory-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const kinds=["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"];
const all=batch.records.map(record=>({record,doc:read(record.source_map_ref)}));
test("Frozen exact 11 source originals have 730 globally unique natural response IDs and source-authenticated SHA",()=>{
 assert.equal(batch.records.length,11);
 assert.equal(batch.source_slots_new,730);
 assert.deepEqual(all.map(({doc})=>doc.items.length),[70,70,54,49,42,60,62,79,64,80,100]);
 assert.equal(new Set(batch.records.map(r=>r.source_candidate_id)).size,11);
 const ids=new Set();
 for(const {record,doc} of all){
  assert.equal(doc.source_candidate_id,record.source_candidate_id);
  assert.equal(doc.items.length,record.source_answer_positions);
  for(const item of doc.items){
   assert.ok(!ids.has(item.source_slot_id),"duplicate source original slot "+item.source_slot_id);
   ids.add(item.source_slot_id);
   assert.equal(item.public_release_approved,false);
  }
  const original=v16.source_papers.find(s=>s.source_candidate_id===record.source_candidate_id);
  assert.ok(original);
  assert.equal(record.source_pdf_sha256,original.source_pdf_sha256);
 }
 assert.equal(ids.size,730);
});
test("Each source-position KP FIRST classification is among 45 grade4 first-semester canonical points",()=>{
 const allow=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(allow.size,45);
 const tally=Object.fromEntries(kinds.map(k=>[k,0]));
 for(const {doc} of all)for(const item of doc.items){
  assert.ok(kinds.includes(item.kp_first_decision));
  const ids=item.matched_canonical_kp_ids??item.canonical_kp_ids??item.kp_ids??[];
  assert.ok(ids.every(id=>allow.has(id)),item.source_slot_id);
  if([kinds[0],kinds[1]].includes(item.kp_first_decision))assert.ok(ids.length>0,item.source_slot_id);
  tally[item.kp_first_decision]++;
 }
 assert.deepEqual(tally,{"KP_MATCH_CANDIDATE":372,"KP_MATCH_SOURCE_EVIDENCE_HOLD":114,"REVIEW_KP_UNCERTAIN":50,"NONMATCH_G04S1_KP_ARCHIVE":194});
 assert.equal(tally.KP_MATCH_CANDIDATE+tally.KP_MATCH_SOURCE_EVIDENCE_HOLD,486);
});
test("Image-only scanned originals are sourced from genuine PDFs, kept separate from OCR or fabricated positions",()=>{
 assert.equal(batch.new_original_image_only_positions,243);
 assert.equal(batch.new_source_text_positions,487);
 assert.equal(batch.records.filter(r=>r.source_modality==="ORIGINAL_PDF_IMAGE_ONLY").length,4);
 const scans=all.filter(x=>x.record.source_modality==="ORIGINAL_PDF_IMAGE_ONLY");
 assert.deepEqual(scans.map(x=>x.doc.items.length),[70,70,54,49]);
 assert.equal(scans[2].doc.source_score_to_position_gap_points,4);
 const shihu=all.find(x=>x.doc.source_candidate_id==="SCI_G04_S1_114_FINAL_013");
 assert.equal(shihu.doc.unreconciled_score_points,3);
 const dadun=all.find(x=>x.doc.source_candidate_id==="SCI_G04_S1_114_FINAL_005");
 assert.equal(dadun.doc.items.filter(x=>x.section===3&&x.original_group==="G01A"&&x.score_points===null).length,6);
 assert.equal(dadun.doc.source_group1_part1_aggregate_score_points,2);
 assert.equal(dadun.doc.source_score_group_level_parity_verified,true);
 const minquan=all.find(x=>x.doc.source_candidate_id==="SCI_G04_S1_114_FINAL_006");
 assert.equal(minquan.doc.items.filter(x=>x.original_group==="G07"&&x.source_score_points===4).length,1);
});
test("V17 is additive 14/25 to 25/25, without silently conflating source admission and learner/public certification",()=>{
 assert.equal(v16.papers_with_all_textually_identifiable_answer_positions_mapped,14);
 assert.equal(v17.papers_with_all_textually_identifiable_answer_positions_mapped,25);
 assert.equal(v17.source_papers_preliminary_slot_map_complete_count,25);
 assert.equal(v17.other_papers_with_source_outline_only,0);
 assert.equal(v17.source_papers.length,25);
 assert.equal(v17.source_papers.filter(x=>x.original_source_position_text_map_ref).length,25);
 assert.equal(v17.all_identified_source_answer_positions_count,1623);
 assert.equal(v17.textually_identifiable_answer_positions_count,1374);
 assert.equal(v17.original_source_visual_only_positions_identified,249);
 assert.equal(v17.textually_identifiable_answer_positions_count+v17.original_source_visual_only_positions_identified,1623);
 assert.equal(v17.provisional_matched_kp_positions,1170);
 assert.deepEqual(v17.source_text_position_kp_decisions,{"KP_MATCH_CANDIDATE":845,"KP_MATCH_SOURCE_EVIDENCE_HOLD":325,"REVIEW_KP_UNCERTAIN":115,"NONMATCH_G04S1_KP_ARCHIVE":338});
 assert.equal(Object.values(v17.source_text_position_kp_decisions).reduce((x,y)=>x+y,0),1623);
 assert.equal(v17.source_score_points_not_proven_as_distinct_questions,21);
 assert.equal(v17.unresolved_source_score_points_by_paper.SCI_G04_S1_114_MID_009,4);
 assert.equal(v17.unresolved_source_score_points_by_paper.SCI_G04_S1_114_FINAL_013,3);
 assert.equal(v17.source_file_sha_complete_count,22);
 assert.equal(v17.original_all_paper_item_screening_complete_count,0);
 assert.equal(v17.original_science_answer_and_figure_acceptance_complete_count,0);
 assert.equal(v17.public_question_positions_added,0);
 assert.equal(v17.live_exam_answer_slots_still,251);
 assert.equal(v17.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
