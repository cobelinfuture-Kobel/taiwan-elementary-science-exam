import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113FinalMC9} from "../site/assets/js/p12-g04s1-113-final-mc9-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-final-mc9-selective-public-v1.json");
const proof=read("data/review/p12-g04s1-113-final-mc9-selective-formal-source-science-kp-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("P12 113 final nine source exact MC are uniquely certified with original text four choices science KP bbox and operator rights",()=>{
 const gate=validateAndConvertP12113FinalMC9(bank,authority);
 assert.deepEqual([gate.answerSlots,gate.standaloneTf,gate.standaloneChoice,gate.contextGroups],[9,0,9,0]);
 assert.deepEqual([proof.published_before,proof.published_after_if_ALL_release_checks_pass,proof.formal_approved_item_count],[690,699,9]);
 assert.equal(proof.records.length,9);
 assert.equal(new Set(bank.blocks.map(b=>b.source_slot_id)).size,9);
 for(const b of bank.blocks){
  const r=proof.records.find(x=>x.printed_section_and_number===b.source_slot_id);assert.ok(r,b.id);
  assert.deepEqual(r.answer_box_native_pdf_glyph_bbox,b.source_pdf_bbox_pts_top_left);
  assert.equal(r.source_pdf_sha256,b.source_pdf_sha256);
  assert.equal(r.independent_model_answer,b.answer);
  assert.equal(r.exact_current_kp,b.canonical_kp_id);
  assert.equal(r.source_full_stem_and_four_original_options_verified,true);
  assert.equal(r.unique_answer_for_this_printed_question,true);
  assert.equal(r.kp_direct_semantic_match_accepted,true);
  assert.equal(r.all_individual_admission_gates_passed,true);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.deepEqual(b.options.map(x=>x.slice(0,1)),["①","②","③","④"]);
  assert.ok(authority.units.some(u=>u.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id)));
 }
});
test("P12 final school original 9 MC immutable gate fails closed on source answer options KP bbox rights and counts",()=>{
 const edits=[x=>x.blocks[0].answer="②",x=>x.blocks[0].stem+="錯誤",x=>x.blocks[0].options[0]="①錯誤",x=>x.blocks[0].canonical_kp_id="sci_g04s1_01_12",x=>x.blocks[0].source_pdf_sha256="incorrect",x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,x=>x.blocks[0].operator_publication_approval=false,x=>x.blocks[0].copyright_path="UNVERIFIED",x=>x.expected_blocks=10,x=>x.blocks.pop()];
 for(const edit of edits){const v=structuredClone(bank);edit(v);assert.throws(()=>validateAndConvertP12113FinalMC9(v,authority));}
});
test("P12 final nine have no exact identical student question with existing public bank",()=>{
 const known=new Set();
 for(const f of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-final-mc9-selective-public-v1.json")){
  const doc=read("site/data/question-bank/"+f);
  let qs=[...(doc.blocks||[])];for(const g of doc.groups||[])qs.push(...g.items||[]);
  for(const q of qs)if(q.stem)known.add(norm(q.stem)+(q.options||[]).map(norm).join(""));
 }
 for(const b of bank.blocks)assert.ok(!known.has(norm(b.stem)+b.options.map(norm).join("")),"duplicate: "+b.id);
});
