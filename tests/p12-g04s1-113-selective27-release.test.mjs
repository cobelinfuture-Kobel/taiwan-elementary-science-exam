import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113Selective27} from "../site/assets/js/p12-g04s1-113-selective27-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-selective27-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-selective27-formal-source-science-kp-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const normal=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("P12 113 27 distinct source exact student originals satisfy current frozen 48KP and item gate",()=>{
 const gate=validateAndConvertP12113Selective27(bank,authority);
 assert.deepEqual([gate.answerSlots,gate.standaloneTf,gate.standaloneChoice,gate.contextGroups],[27,14,13,0]);
 assert.equal(evidence.formal_approved_item_count,27);
 assert.equal(evidence.records.length,27);
 assert.equal(evidence.kp_authority_count_for_this_grade_semester,48);
 assert.equal(evidence.published_before,636);
 assert.equal(evidence.published_after_if_ALL_release_checks_pass,663);
 assert.equal(evidence.original_teacher_keys_authenticated,false);
 assert.equal(new Set(bank.blocks.map(b=>b.source_slot_id)).size,27);
 assert.equal(new Set(bank.blocks.map(b=>b.id)).size,27);
 for(const b of bank.blocks){
  const r=evidence.records.find(x=>x.printed_section_and_number===b.source_slot_id);
  assert.ok(r,b.source_slot_id);
  assert.deepEqual(r.answer_box_native_pdf_glyph_bbox,b.source_pdf_bbox_pts_top_left);
  assert.equal(r.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(r.independent_model_answer,b.answer);
  assert.equal(r.exact_current_kp,b.canonical_kp_id);
  assert.equal(r.source_full_stem_and_option_projection_verified,true);
  assert.equal(r.unique_answer_for_this_printed_question,true);
  assert.equal(r.kp_direct_semantic_match_accepted,true);
  assert.equal(r.source_regulated_school_exam_identity_verified,true);
  assert.equal(r.no_teacher_key_or_exam_page_published,true);
  assert.equal(r.all_individual_admission_gates_passed,true);
  assert.ok(b.answer_explanation.length>12);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.dependency_review_verified,true);
  assert.equal(b.copyright_path,"SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES");
  assert.ok(b.stem.length>8);
  assert.ok(authority.units.some(u=>u.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id)));
 }
});
test("P12 113 27 fail closed if question text/options, answer, direct KP, source position, rights or counts change",()=>{
 const mutate=[
 x=>x.blocks[0].stem+="失真",
 x=>x.blocks[0].answer=x.blocks[0].answer==="O"?"X":"O",
 x=>x.blocks[1].canonical_kp_id="sci_g04s1_02_13",
 x=>x.blocks[0].source_pdf_sha256="WRONG",
 x=>x.blocks[2].source_page_pdf_1_based=2,
 x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,
 x=>x.blocks.find(b=>b.type==="mcq").options[0]="①被竄改",
 x=>x.blocks[0].answer_explanation="答案篡改",
 x=>x.blocks[0].operator_publication_approval=false,
 x=>x.blocks[0].copyright_path="UNVERIFIED",
 x=>x.blocks[0].original_cropped_assets_included=true,
 x=>x.expected_blocks=28,
 x=>x.blocks.pop()
 ];
 for(const edit of mutate){const copy=structuredClone(bank);edit(copy);assert.throws(()=>validateAndConvertP12113Selective27(copy,authority));}
});
test("P12 113 27 has no existing exact student original duplicate in publicly stored question banks",()=>{
 const dir="site/data/question-bank";
 const other=readdirSync(dir).filter(f=>f.endsWith(".json")&&f!=="p12-g04s1-113-selective27-public-v1.json");
 const known=new Set();
 for(const f of other){const j=read(dir+"/"+f);
  for(const b of j.blocks||[]){if(b.stem)known.add(normal(b.stem)+(b.options||[]).map(normal).join("")); }
  for(const g of j.groups||[])for(const b of g.items||[]){if(b.stem)known.add(normal(b.stem)+(b.options||[]).map(normal).join(""));}
 }
 for(const b of bank.blocks){const key=normal(b.stem)+(b.options||[]).map(normal).join("");assert.ok(!known.has(key),"re-published exact question "+b.id);}
});
