import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113TaizijiaoRemaining8} from "../site/assets/js/p12-g04s1-113-taozijiao-final-remaining8-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-taozijiao-final-remaining8-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-taozijiao-final-remaining8-formal-source-science-kp-v1.json");
const source=read("data/review/p12-g04s1-113-taozijiao-final-page1-remaining20-text-preflight-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("Taizijiao remaining20: 20 exact original page1 native glyphs, eight admission, twelve isolated holds",()=>{
 const result=validateAndConvertP12113TaizijiaoRemaining8(bank,authority);
 assert.deepEqual([result.answerSlots,result.standaloneTf,result.standaloneChoice,result.contextGroups],[8,8,0,0]);
 assert.equal(source.records.length,20);
 assert.equal(source.exact_raw_pdf_answer_bbox_certified_this_run,20);
 assert.equal(evidence.formal_science_kp_approved_count,8);
 assert.equal(evidence.admission_ready_in_this_release,8);
 assert.equal(evidence.excluded_source_items.length,12);
 assert.deepEqual([evidence.current_published_answer_slots_before,evidence.published_after_successful_ci_and_pages_e2e],[716,724]);
 assert.equal(evidence.records.length,8);
 assert.equal(new Set(bank.blocks.map(b=>b.source_slot_id)).size,8);
 for(const b of bank.blocks){
  const pre=source.records.find(x=>x.source_slot_id===b.source_slot_id);
  const formal=evidence.records.find(x=>x.source_slot_id===b.source_slot_id);
  assert.ok(pre&&formal,b.id);
  assert.equal(pre.original_stem_linebreak_normalized,b.stem);
  assert.equal(b.answer,formal.unique_answer);
  assert.equal(b.canonical_kp_id,pre.proposed_direct_canonical_kp);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,pre.source_marker_pdf_bbox_pts_top_left);
  assert.deepEqual(formal.answer_glyph_bbox_exact_native_pdf,b.source_pdf_bbox_pts_top_left);
  assert.equal(pre.bbox_status,"PASS_ORIGINAL_PDF_RAWDICT_EXACT_FIRST_ANSWER_OPEN_CLOSE_PAREN_CHAR_BBOX");
  assert.equal(formal.science_unique_answer_accepted,true);
  assert.equal(formal.direct_kp_accepted,true);
  assert.equal(formal.duplication_gate_accepted,true);
  assert.equal(formal.article9_exam_question_text_rights_accepted,true);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
 }
 for(const h of evidence.excluded_source_items)assert.ok(!bank.blocks.some(b=>b.source_slot_id===h.source_slot_id));
});
test("Taizijiao remaining8 immutable formal Source/Science/KP/Rights fail closed",()=>{
 const edits=[
  x=>x.blocks[0].stem+="x",x=>x.blocks[0].answer="O",x=>x.blocks[0].canonical_kp_id="sci_g04s1_03_07",
  x=>x.blocks[0].source_pdf_sha256="CORRUPTED",x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=2,
  x=>x.blocks[0].operator_publication_approval=false,x=>x.blocks[0].copyright_path="UNKNOWN",
  x=>x.blocks.pop(),x=>x.expected_answer_slots=10
 ];
 for(const fn of edits){const copy=structuredClone(bank);fn(copy);assert.throws(()=>validateAndConvertP12113TaizijiaoRemaining8(copy,authority));}
});
test("Taizijiao remaining8 no exact duplicate stem or source ID across public source banks",()=>{
 const texts=new Set(),slots=new Set();
 for(const file of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-taozijiao-final-remaining8-public-v1.json")){
  const j=read("site/data/question-bank/"+file);let blocks=[...(j.blocks||[])];
  for(const g of j.groups||[])blocks.push(...(g.items||[]));
  for(const b of blocks){if(b.stem)texts.add(norm(b.stem)+(b.options||[]).map(norm).join(""));if(b.source_slot_id)slots.add(b.source_slot_id);}
 }
 for(const b of bank.blocks){assert.ok(!texts.has(norm(b.stem)),b.id);assert.ok(!slots.has(b.source_slot_id),b.source_slot_id);}
});
