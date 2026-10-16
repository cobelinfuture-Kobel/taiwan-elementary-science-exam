import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113Mid11} from "../site/assets/js/p12-g04s1-113-mid11-selective-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-mid11-selective-public-v1.json");
const proof=read("data/review/p12-g04s1-113-mid11-selective-formal-source-science-kp-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const normal=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("P12 113 11 original school MC pass frozen 48KP source BBox science and rights gates",()=>{
 const gate=validateAndConvertP12113Mid11(bank,authority);
 assert.deepEqual([gate.answerSlots,gate.standaloneTf,gate.standaloneChoice,gate.contextGroups],[11,0,11,0]);
 assert.equal(proof.formal_approved_item_count,11);
 assert.deepEqual([proof.published_before,proof.published_after_if_ALL_release_checks_pass],[679,690]);
 assert.equal(proof.records.length,11);
 assert.equal(new Set(bank.blocks.map(x=>x.id)).size,11);
 assert.equal(new Set(bank.blocks.map(x=>x.source_slot_id)).size,11);
 for(const b of bank.blocks){
  const r=proof.records.find(x=>x.printed_section_and_number===b.source_slot_id);
  assert.ok(r,b.id);
  assert.equal(r.independent_model_answer,b.answer);
  assert.equal(r.exact_current_kp,b.canonical_kp_id);
  assert.deepEqual(r.answer_box_native_pdf_glyph_bbox,b.source_pdf_bbox_pts_top_left);
  assert.equal(r.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(r.source_full_stem_and_four_original_options_verified,true);
  assert.equal(r.unique_answer_for_this_printed_question,true);
  assert.equal(r.kp_direct_semantic_match_accepted,true);
  assert.equal(r.all_individual_admission_gates_passed,true);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.type,"mcq");
  assert.deepEqual(b.options.map(x=>x.slice(0,1)),["①","②","③","④"]);
  assert.ok(authority.units.some(u=>u.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id)));
 }
});
test("P12 113 11 fail-closed against any unapproved source answer KP BBox rights or printed option mutation",()=>{
 const mutate=[
  x=>x.blocks[0].stem+="不合法",
  x=>x.blocks[0].answer="②",
  x=>x.blocks[0].options[0]="①破壞原題",
  x=>x.blocks[0].answer_explanation="改寫",
  x=>x.blocks[0].canonical_kp_id="sci_g04s1_02_13",
  x=>x.blocks[0].source_pdf_sha256="WRONG",
  x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,
  x=>x.blocks[0].operator_publication_approval=false,
  x=>x.blocks[0].copyright_path="UNVERIFIED",
  x=>x.expected_answer_slots=12,
  x=>x.blocks.pop()
 ];
 for(const edit of mutate){const changed=structuredClone(bank);edit(changed);assert.throws(()=>validateAndConvertP12113Mid11(changed,authority));}
});
test("P12 113 11 new MC texts and ordered options do not exactly repeat any public bank question",()=>{
 const known=new Set();
 for(const filename of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-mid11-selective-public-v1.json")){
  const bank=read("site/data/question-bank/"+filename);
  const blocks=[...(bank.blocks||[])];for(const g of bank.groups||[])blocks.push(...g.items||[]);
  for(const b of blocks)if(b.stem)known.add(normal(b.stem)+(b.options||[]).map(normal).join(""));
 }
 for(const b of bank.blocks)assert.ok(!known.has(normal(b.stem)+b.options.map(normal).join("")),"duplicate original "+b.id);
});
