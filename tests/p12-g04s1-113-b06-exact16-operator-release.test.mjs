import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateAuthority} from '../site/assets/js/authority-adapter.mjs';
import {validateAndConvertP12113B06Native16} from '../site/assets/js/p12-g04s1-113-b06-native16-standalone-release.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const bank=read('../site/data/question-bank/p12-g04s1-113-b06-native16-standalone-public-v1.json');
const proof=read('../data/review/p12-g04s1-113-b06-exact16-operator-approved-formal-v1.json');
const authority=validateAuthority(read('../site/data/authority/science-g03-g04-selector-v3.json'));
const norm=s=>String(s).replace(/\r\n|\r|\n/g,'').trim();
test('B06 50 original school positions partition: exact16 operator approved, 34 immutable HOLD',()=>{
 const v=validateAndConvertP12113B06Native16(bank,authority);
 assert.deepEqual([v.answerSlots,v.standaloneTf,v.standaloneChoice,v.contextGroups],[16,5,11,0]);
 assert.deepEqual(proof.formal_before_live,{FORMAL_SCIENCE_KP_APPROVED_new:16,ADMISSION_READY_new:16,PUBLISHED_new:0});
 assert.equal(proof.operator_input_verbatim,'P12_G04S1_113_B06_Exact16_OperatorApproval_SelectiveStudentPR_FocusedCI_MainReadback_PagesLiveE2E_34HOLD_NoB01ToB05Reopen');
 assert.equal(proof.scope.source_work_positions,50);
 assert.equal(proof.scope.operator_exact16,16);
 assert.equal(proof.scope.retained_HOLD,34);
 assert.equal(proof.source_number_before,293);
 assert.equal(proof.site_answer_slots_before,929);
 assert.equal(proof.scope_no_B01_to_B05_reopen,true);
 assert.equal(proof.source_draft_PR124_unchanged_and_unmerged,true);
 assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),proof.records.map(x=>x.original_source_slot_id));
 assert.equal(bank.blocks.filter(x=>x.source_id==='SCI_G04_S1_113_MID_018').length,11);
 assert.equal(bank.blocks.filter(x=>x.source_id==='SCI_G04_S1_113_FINAL_010').length,5);
 const both=[...bank.blocks.map(x=>x.source_slot_id),...proof.excluded_hold_34_original_source_rows.map(x=>x.source_id)];
 assert.equal(both.length,50);
 assert.equal(new Set(both).size,50);
 assert.ok(!bank.blocks.some(x=>x.source_slot_id===proof.scope.other_114_paper_near_match_HOLD));
 assert.ok(!bank.blocks.some(x=>x.source_slot_id===proof.scope.defective_source_option_HOLD));
});
test('B06 16 exact original full statements/four printed option texts/native answer box/Science and 48 KP; no exam score',()=>{
 for(const [i,b] of bank.blocks.entries()){
  const p=proof.records[i];
  assert.equal(b.source_slot_id,p.original_source_slot_id);
  assert.equal(b.source_original_slot_id,p.original_source_legacy_id);
  assert.equal(b.source_pdf_sha256,p.original_pdf_sha256);
  assert.equal(b.source_page_pdf_1_based,p.original_pdf_page);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,p.original_native_answer_bbox_pdf_pts_top_left);
  assert.equal(b.stem,norm(p.original_stem_verbatim));
  assert.equal(b.answer,p.proposed_independent_answer_not_school_teacher_key);
  assert.equal(b.answer_explanation,p.proposed_science_reason);
  assert.equal(b.canonical_kp_id,p.proposed_frozen_113_48kp);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.public_material_scope,'EXAM_QUESTION_TEXT_ONLY');
  assert.equal(b.rights_license_status,'REGULATED_EXAM_QUESTION_ART9');
  assert.equal(b.operator_publication_approval,true);
  assert.equal(p.exact16_operator_approved,true);
  assert.ok(!Object.hasOwn(b,'points')&&!Object.hasOwn(b,'score'));
  if(b.type==='mcq'){
   assert.deepEqual(b.options,p.original_ordered_options_verbatim.map((o,j)=>['①','②','③','④'][j]+norm(o.text)));
  }else assert.ok(!Object.hasOwn(b,'options'));
 }
});
test('B06 immutable fail-close source, answer, options, KP, rights, operator gates',()=>{
 for(const field of ['stem','source_pdf_sha256','source_pdf_bbox_pts_top_left','answer','canonical_kp_id','rights_license_status','operator_publication_approval']){
  const t=structuredClone(bank);
  t.blocks[0][field]=field==='operator_publication_approval'?false:'INVALID';
  assert.throws(()=>validateAndConvertP12113B06Native16(t,authority),/FAIL_CLOSED/);
 }
 const t=structuredClone(bank);t.blocks.find(z=>z.type==='mcq').options[2]+='被竄改';
 assert.throws(()=>validateAndConvertP12113B06Native16(t,authority),/FAIL_CLOSED/);
});
test('B06 new 16 gated by R5 loader; B01 through B05 unaffected',()=>{
 const code=readFileSync(new URL('../site/assets/js/historical-bank-ox-v6.mjs',import.meta.url),'utf8');
 assert.match(code,/activeR5\?validateAndConvertP12113B06Native16/);
 for(const k of ['...b06Native16.blocks','+b06Native16.standaloneTf','+b06Native16.standaloneChoice','+b06Native16.answerSlots'])
 assert.ok(code.includes(k));
 for(const previous of ['...b01Wende7.blocks','...b02Native21.blocks','...b03Native27.blocks','...b04Native36.blocks','...b05Native24.blocks'])
 assert.ok(code.includes(previous));
});
