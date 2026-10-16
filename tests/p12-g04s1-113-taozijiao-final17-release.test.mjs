import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113TaizijiaoFinal17} from "../site/assets/js/p12-g04s1-113-taozijiao-final17-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-taozijiao-final17-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-taozijiao-final17-formal-source-science-kp-v1.json");
const source=read("data/review/p12-g04s1-113-taozijiao-final22-source-science-kp-prefilter-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("Taizijiao 113 first-page native PDF 17 OX individual admission and five isolated holds",()=>{
 const result=validateAndConvertP12113TaizijiaoFinal17(bank,authority);
 assert.deepEqual([result.answerSlots,result.standaloneTf,result.standaloneChoice,result.contextGroups],[17,17,0,0]);
 assert.equal(source.records.length,22);
 assert.equal(source.records.filter(x=>x.admission_status==="HOLD_DO_NOT_ADMIT").length,5);
 assert.equal(evidence.formal_science_kp_approved_count,17);
 assert.deepEqual([evidence.current_published_answer_slots_before,evidence.published_after_successful_ci_and_pages_e2e],[699,716]);
 assert.equal(evidence.records.length,17);
 assert.equal(new Set(bank.blocks.map(x=>x.source_slot_id)).size,17);
 for(const b of bank.blocks){
  const pre=source.records.find(x=>x.source_slot_id===b.source_slot_id);
  const formal=evidence.records.find(x=>x.source_slot_id===b.source_slot_id);
  assert.ok(pre&&formal,b.id);
  assert.equal(pre.admission_status,"PASSES_SOURCE_SCIENCE_KP_DUPLICATE_REVIEW_RELEASE_GATES_APPLY");
  assert.equal(b.stem,pre.stem);
  assert.equal(b.answer,pre.answer);
  assert.equal(b.canonical_kp_id,pre.canonical_kp_id);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,pre.bbox_pt);
  assert.deepEqual(formal.answer_glyph_bbox_exact_native_pdf,b.source_pdf_bbox_pts_top_left);
  assert.equal(pre.bbox_method,"EXACT_PDF_RAWDICT_OPEN_AND_CLOSE_BRACKET_CHAR_BBOX");
  assert.equal(b.source_pdf_sha256,source.original_sha256);
  assert.equal(formal.science_unique_answer_accepted,true);
  assert.equal(formal.direct_kp_accepted,true);
  assert.equal(formal.duplication_gate_accepted,true);
  assert.equal(formal.article9_exam_question_text_rights_accepted,true);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
  assert.ok(authority.units.some(u=>u.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id)));
 }
});
test("Taizijiao immutable original fail closes on answer, stem, native box, KP, source and rights",()=>{
 const edits=[
 x=>x.blocks[0].stem+="x",x=>x.blocks[0].answer="O",x=>x.blocks[0].canonical_kp_id="sci_g04s1_03_07",
 x=>x.blocks[0].source_pdf_sha256="CORRUPTED",x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=2,
 x=>x.blocks[0].operator_publication_approval=false,x=>x.blocks[0].copyright_path="UNKNOWN",x=>x.blocks.pop(),x=>x.expected_answer_slots=18
 ];
 for(const fn of edits){const d=structuredClone(bank);fn(d);assert.throws(()=>validateAndConvertP12113TaizijiaoFinal17(d,authority));}
 const frozenV2=read("site/data/authority/science-g03-g04-selector-v2.json");
 assert.throws(()=>validateAndConvertP12113TaizijiaoFinal17(bank,frozenV2));
});
test("Taizijiao 17 no exact duplicate published stem or source slot in prior bank JSONs",()=>{
 const texts=new Set(),slots=new Set();
 for(const file of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-taozijiao-final17-public-v1.json")){
  const j=read("site/data/question-bank/"+file);let blocks=[...(j.blocks||[])];for(const g of j.groups||[])blocks.push(...(g.items||[]));
  for(const b of blocks){if(b.stem)texts.add(norm(b.stem)+(b.options||[]).map(norm).join(""));if(b.source_slot_id)slots.add(b.source_slot_id)}
 }
 for(const b of bank.blocks){assert.ok(!texts.has(norm(b.stem)),b.id);assert.ok(!slots.has(b.source_slot_id),b.source_slot_id);}
});
