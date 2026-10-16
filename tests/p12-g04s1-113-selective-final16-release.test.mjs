import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113Final16} from "../site/assets/js/p12-g04s1-113-selective-final16-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-selective-final16-public-v1.json");
const proof=read("data/review/p12-g04s1-113-selective-final16-formal-source-science-kp-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v3.json");
const prior=read("site/data/question-bank/p12-g04s1-113-selective27-public-v1.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("P12 113 second selective batch formal 16 new standalone TF has complete source science KP and native BBox",()=>{
  const gate=validateAndConvertP12113Final16(bank,auth);
  assert.deepEqual([gate.answerSlots,gate.standaloneTf,gate.standaloneChoice,gate.contextGroups],[16,16,0,0]);
  assert.equal(proof.formal_approved_item_count,16);
  assert.deepEqual([proof.source_baseline_public_slots,proof.student_slots_if_complete_pages_e2e],[663,679]);
  assert.equal(proof.records.length,16);
  assert.equal(new Set(bank.blocks.map(b=>b.id)).size,16);
  assert.equal(new Set(bank.blocks.map(b=>b.source_slot_id)).size,16);
  const known=new Set(prior.blocks.map(b=>b.source_slot_id));
  for(const b of bank.blocks){
    assert.ok(!known.has(b.source_slot_id));
    const e=proof.records.find(r=>r.printed_section_and_number===b.source_slot_id);
    assert.ok(e,b.id);
    assert.equal(b.answer,e.independent_model_answer);
    assert.equal(b.canonical_kp_id,e.exact_current_kp);
    assert.deepEqual(b.source_pdf_bbox_pts_top_left,e.answer_box_native_pdf_glyph_bbox);
    assert.equal(b.source_pdf_sha256,e.original_pdf_sha256);
    assert.equal(e.unique_answer_for_this_printed_question,true);
    assert.equal(e.kp_direct_semantic_match_accepted,true);
    assert.equal(e.source_regulated_school_exam_identity_verified,true);
    assert.equal(e.all_individual_admission_gates_passed,true);
    assert.equal(b.operator_publication_approval,true);
    assert.equal(b.original_cropped_assets_included,false);
    assert.equal(b.original_teacher_answer_key_authenticated,false);
    assert.equal(b.type,"tf");
    assert.ok(b.answer_explanation.length>15);
    assert.ok(auth.units.some(u=>u.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id)));
  }
});
test("P12 113 final16 immutable runtime fails closed on changed original, science, KP, source and rights",()=>{
  const edits=[
    x=>x.blocks[0].stem+="改",
    x=>x.blocks[0].answer="X",
    x=>x.blocks[0].answer_explanation="不正確",
    x=>x.blocks[0].canonical_kp_id="sci_g04s1_03_10",
    x=>x.blocks[0].source_pdf_sha256="UNKNOWN",
    x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,
    x=>x.blocks[0].source_slot_id="MISSING",
    x=>x.blocks[0].operator_publication_approval=false,
    x=>x.blocks[0].copyright_path="UNVERIFIED",
    x=>x.expected_answer_slots=17,
    x=>x.blocks.pop()
  ];
  for(const fn of edits){const x=structuredClone(bank);fn(x);assert.throws(()=>validateAndConvertP12113Final16(x,auth));}
});
test("P12 113 final16 new stems have no exact pre-existing public bank item duplicates",()=>{
  const files=readdirSync("site/data/question-bank").filter(n=>n.endsWith(".json")&&n!=="p12-g04s1-113-selective-final16-public-v1.json");
  const existing=new Set();
  for(const f of files){
    const j=read("site/data/question-bank/"+f);
    for(const b of j.blocks||[])if(b.stem)existing.add(norm(b.stem)+(b.options||[]).map(norm).join(""));
    for(const g of j.groups||[])for(const b of g.items||[])if(b.stem)existing.add(norm(b.stem)+(b.options||[]).map(norm).join(""));
  }
  for(const b of bank.blocks){assert.ok(!existing.has(norm(b.stem)),"prior public exact duplicate "+b.id);}
});
