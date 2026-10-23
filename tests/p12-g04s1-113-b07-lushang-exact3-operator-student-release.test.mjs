import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateAuthority} from '../site/assets/js/authority-adapter.mjs';
import {validateAndConvertP12113B07LushangExact3} from '../site/assets/js/p12-g04s1-113-b07-lushang-exact3-standalone-release.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const bank=read('../site/data/question-bank/p12-g04s1-113-b07-lushang-exact3-standalone-public-v1.json');
const proof=read('../data/review/p12-g04s1-113-b07-lushang-exact3-operator-approved-formal-v1.json');
const authority=validateAuthority(read('../site/data/authority/science-g03-g04-selector-v3.json'));
const norm=x=>String(x).replace(/\r\n|\r|\n/g,'').trim();
test('B07 exact 3 source MCs original 113, frozen 48 KP, source PDF/native BBox, unique science and operator approval',()=>{
 const out=validateAndConvertP12113B07LushangExact3(bank,authority);
 assert.deepEqual([out.answerSlots,out.standaloneTf,out.standaloneChoice,out.contextGroups],[3,0,3,0]);
 assert.equal(proof.exact3_operator_approved,true);
 assert.deepEqual(proof.approved_exact_ordinals,[324,326,327]);
 assert.deepEqual(proof.formal_before_live,{FORMAL_SCIENCE_KP_APPROVED_new:3,ADMISSION_READY_new:3,PUBLISHED_new:0});
 assert.equal(proof.source50_total,50);assert.equal(proof.source50_HOLD_count,47);
 assert.equal(proof.source50_dispositions.length,50);
 assert.equal(proof.source50_dispositions.filter(x=>x.disposition==='EXACT3_OPERATOR_RELEASE_APPROVED').length,3);
 assert.equal(proof.source50_dispositions.filter(x=>x.disposition==='RETAIN_EXISTING_HOLD').length,47);
 assert.equal(proof.other_B07_TFMC1_held,true);assert.equal(proof.G02_six_picture_HOLD,true);
 assert.equal(proof.Q325_excluded,true);assert.equal(proof.no_B01_to_B06_reopen,true);
 assert.equal(proof.source_review_PR_merge_prohibited,true);
 assert.equal(proof.pre_public_answer_slots,945);
 assert.equal(proof.pre_113_published_source_question_count,309);
 assert.equal(proof.full_113_scan5_visual_pages_checked,16);
 assert.equal(proof.full_114_original_questions_dedup_screened,717);
 assert.equal(proof.public_question_bank_G04_module_records_screened,742);
 assert.equal(proof.confirmed_question_duplicates,0);
 assert.equal(proof.rights.public_material_scope,'EXAM_QUESTION_TEXT_ONLY');
 assert.equal(proof.rights.third_party_content_clearance,'NO_THIRD_PARTY_COPY');
 assert.equal(proof.original_source_scans_pdf_thirdparty_assets_not_student_public,true);
 assert.match(proof.operator_input_verbatim,/B07_LUSHANG_EXACT3_[\s\S]*OperatorApproval_/);
 assert.deepEqual(bank.blocks.map(x=>x.id),proof.records.map(x=>x.potential_student_bank_id));
 for(const [i,b] of bank.blocks.entries()){
  const e=proof.records[i];
  assert.equal(b.source_slot_id,e.original_source_worklist_id);
  assert.equal(b.source_original_slot_id,e.canonical_113_original_source_slot_id);
  assert.equal(b.source_pdf_sha256,e.original_pdf_sha256);
  assert.equal(b.source_page_pdf_1_based,e.original_pdf_page_1based);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,e.original_native_answer_bbox_pt_top_left);
  assert.equal(b.stem,norm(e.original_question_stem_verbatim));
  assert.deepEqual(b.options,e.original_ordered_choice_texts.map((x,j)=>['①','②','③','④'][j]+norm(x)));
  assert.equal(b.answer,e.independent_science_choice_proposal_not_school_key);
  assert.equal(b.canonical_kp_id,e.direct_frozen113_48KP_proposal);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.ok(!Object.hasOwn(b,'score')&&!Object.hasOwn(b,'points'));
  assert.ok(!Object.hasOwn(b,'reading_parent')&&!Object.hasOwn(b,'original_parent_text'));
 }
 assert.ok(!bank.blocks.some(x=>x.source_original_slot_id.endsWith('|002')));
});
test('B07 release tamper guard rejects mutated text/choices/answer/KP/rights/source and operator flag',()=>{
 const mutations=[
  [0,'stem','被竄改'],
  [0,'source_pdf_sha256','bad'],
  [0,'source_pdf_bbox_pts_top_left',[0,0,0,0]],
  [0,'answer','①'],
  [0,'canonical_kp_id','sci_g04s1_02_01'],
  [0,'rights_license_status','UNVERIFIED'],
  [0,'operator_publication_approval',false],
  [0,'reading_parent','原文共用閱讀內容']
 ];
 for(const [i,key,value] of mutations){const t=structuredClone(bank);t.blocks[i][key]=value;assert.throws(()=>validateAndConvertP12113B07LushangExact3(t,authority),/FAIL_CLOSED/,key)}
 for(const i of [0,1,2]){const t=structuredClone(bank);t.blocks[i].options[3]+='被竄改';assert.throws(()=>validateAndConvertP12113B07LushangExact3(t,authority),/FAIL_CLOSED/);}
 const t=structuredClone(bank);t.blocks.push(structuredClone(t.blocks[0]));assert.throws(()=>validateAndConvertP12113B07LushangExact3(t,authority),/FAIL_CLOSED/);
});
test('B07 actual R5 loader adds exactly 3 MC and leaves all earlier B01–B06 modules intact',()=>{
 const code=readFileSync(new URL('../site/assets/js/historical-bank-ox-v6.mjs',import.meta.url),'utf8');
 assert.match(code,/validateAndConvertP12113B07LushangExact3/);
 assert.match(code,/\.\.\.b06Native16.blocks,\.\.\.b07LushangExact3.blocks/);
 for(const s of ['standaloneTf','standaloneChoice','contextGroups','answerSlots'])assert.ok(code.includes('+b06Native16.'+s+'+b07LushangExact3.'+s));
 for(const old of ['...b01Wende7.blocks','...b02Native21.blocks','...b03Native27.blocks','...b04Native36.blocks','...b05Native24.blocks','...b06Native16.blocks'])assert.ok(code.includes(old));
});
