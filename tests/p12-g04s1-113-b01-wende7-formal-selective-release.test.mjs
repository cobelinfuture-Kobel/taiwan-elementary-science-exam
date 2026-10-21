import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12113B01Wende7,P12_113_B01_WENDE7_PATH} from "../site/assets/js/p12-g04s1-113-b01-wende7-standalone-release.mjs";
import {validateAuthority} from "../site/assets/js/authority-adapter.mjs";
const parse=(path)=>JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8"));
const doc=parse("../site/data/question-bank/p12-g04s1-113-b01-wende7-standalone-public-v1.json");
const proof=parse("../data/review/p12-g04s1-113-b01-7standalone-operator-approved-formal-v1.json");
const authority=validateAuthority(parse("../site/data/authority/science-g03-g04-selector-v3.json"));
test("seven Wende original 113 G04S1 standalone authorized, frozen exact 48KP, native SHA+BBox, Article9 rights",()=>{
  const p=validateAndConvertP12113B01Wende7(doc,authority);
  assert.equal(P12_113_B01_WENDE7_PATH,"../data/question-bank/p12-g04s1-113-b01-wende7-standalone-public-v1.json");
  assert.equal(p.admission,"P12_113_B01_WENDE7_CERTIFIED_OPERATOR_APPROVED");
  assert.equal(p.answerSlots,7);
  assert.equal(p.standaloneTf,4);
  assert.equal(p.standaloneChoice,3);
  assert.equal(p.contextGroups,0);
  assert.equal(new Set(p.blocks.map(x=>x.id)).size,7);
  assert.deepEqual(p.blocks.map(x=>x.source_slot_id),proof.records.map(x=>x.original_source_id));
  assert.equal(proof.operator_input_verbatim,"核准, 續跑");
  assert.equal(proof.formal_before_merge.FORMAL_SCIENCE_KP_APPROVED_new,7);
  assert.equal(proof.formal_before_merge.ADMISSION_READY_new,7);
  assert.equal(proof.formal_before_merge.PUBLISHED_new,0);
  assert.equal(proof.B01_50_position_closed,false);
  assert.equal(proof.B02_NOT_STARTED,true);
});
test("immutable source, options, answer, KP and rights fail-closed on all tampering",()=>{
  for(const field of ["stem","canonical_kp_id","answer","source_pdf_sha256","rights_license_status","operator_publication_approval"]){
    const bad=structuredClone(doc);
    bad.blocks[0][field]=field==="operator_publication_approval"?false:"ALTERED";
    assert.throws(()=>validateAndConvertP12113B01Wende7(bad,authority),/FAIL_CLOSED/);
  }
  const wrong=structuredClone(doc);
  wrong.blocks[5].options[1]="②相似但非原卷的選項";
  assert.throws(()=>validateAndConvertP12113B01Wende7(wrong,authority),/FAIL_CLOSED/);
});
test("cross-school exact same source retains aliases; not released twice; no B01 parent group or HOLD",()=>{
  const out=validateAndConvertP12113B01Wende7(doc,authority);
  assert.equal(out.blocks.filter(x=>Array.isArray(x.source_lineage_ids)).length,2);
  assert.ok(!out.blocks.some(x=>/S03\|G05|S03\|G06|S03-G05|S03-G06/.test(x.source_slot_id)));
  assert.ok(out.blocks.every(x=>x.source_slot_id.startsWith("SCI_G04_S1_113_MID_001|")));
  assert.equal(proof.unrelated_31_HOLD_unchanged,true);
  assert.equal(proof.parent_S03G05_4slots,"HOLD_SEPARATE_ATOMIC_PARENT");
  assert.equal(proof.parent_S03G06_5slots,"HOLD_SEPARATE_ATOMIC_PARENT");
});
test("public loader fetches B01 Wende7 solely on formal 48KP authority and adds 7 to output",()=>{
  const txt=readFileSync(new URL("../site/assets/js/historical-bank-ox-v6.mjs",import.meta.url),"utf8");
  assert.match(txt,/validateAndConvertP12113B01Wende7/);
  assert.match(txt,/\.\.\.b01Wende7.blocks/);
  assert.match(txt,/\+b01Wende7.answerSlots/);
  assert.match(txt,/\+b01Wende7.standaloneTf/);
  assert.match(txt,/\+b01Wende7.standaloneChoice/);
  assert.match(txt,/activeR5\?validateAndConvertP12113B01Wende7/);
});
