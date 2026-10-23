import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateAuthority} from '../site/assets/js/authority-adapter.mjs';
import {validateAndConvertP12113B07Exact4} from '../site/assets/js/p12-g04s1-113-b07-exact4-standalone-release.mjs';
const read=x=>JSON.parse(readFileSync(new URL('../'+x,import.meta.url),'utf8'));
const bank=read('site/data/question-bank/p12-g04s1-113-b07-exact4-standalone-public-v1.json');
const evidence=read('data/review/p12-g04s1-113-b07-exact4-operator-approved-formal-v1.json');
const authority=validateAuthority(read('site/data/authority/science-g03-g04-selector-v3.json'));
test('B07 exact4 original 3/4 choices and immutable source SHA/BBox, 113 KP, operator scope, 43 original holds',()=>{
 const out=validateAndConvertP12113B07Exact4(bank,authority);
 assert.deepEqual([out.answerSlots,out.standaloneTf,out.standaloneChoice,out.contextGroups],[4,0,4,0]);
 assert.deepEqual(evidence.approved_original_ordinals,[306,335,336,337]);
 assert.deepEqual(evidence.formal_before_live,{FORMAL_SCIENCE_KP_APPROVED_new:4,ADMISSION_READY_new:4,PUBLISHED_new:0});
 assert.equal(evidence.current_published_113_origin_sourceIDs_before,312);
 assert.equal(evidence.current_public_answer_slots_before,948);
 assert.equal(evidence.remaining_original_50_held_after_publication,43);
 assert.equal(evidence.source50_original_count,50);
 assert.equal(evidence.Q305_hold,true);assert.equal(evidence.Q325_hold,true);
 assert.equal(evidence.G02_picture_six_hold,true);assert.equal(evidence.independent_B07_TFMC1_hold,true);
 assert.equal(evidence.B01_B06_no_reopen,true);assert.equal(evidence.source_review_PR124_draft_separate_unmerged,true);
 assert.equal(evidence.original_parent_article_or_figures_published,false);
 assert.deepEqual(bank.blocks.map(x=>x.options.length),[3,4,4,4]);
 assert.deepEqual(bank.blocks.map(x=>x.answer),['②','④','③','①']);
 assert.deepEqual(bank.blocks.map(x=>x.canonical_kp_id),['sci_g04s1_02_04','sci_g04s1_02_02','sci_g04s1_02_09','sci_g04s1_02_02']);
 assert.equal(new Set(bank.blocks.map(x=>x.source_original_slot_id)).size,4);
 for(const [i,x] of bank.blocks.entries()){
  const r=evidence.records[i];
  assert.equal(x.id,r.student_id);assert.equal(x.source_id,r.source_id);
  assert.equal(x.source_slot_id,r.source_legacy_slot_id);assert.equal(x.source_original_slot_id,r.source_original_slot_id);
  assert.equal(x.source_pdf_sha256,r.source_pdf_sha256);assert.equal(x.source_page_pdf_1_based,r.source_page_pdf_1_based);
  assert.deepEqual(x.source_pdf_bbox_pts_top_left,r.source_answer_bbox_pdf_pts);
  assert.equal(x.stem,r.stem);assert.deepEqual(x.options,r.ordered_options.map((o,j)=>['①','②','③','④'][j]+o));
  assert.equal(x.answer,r.answer_model_independently_derived_not_original_teacher_key);
  assert.equal(x.original_teacher_answer_key_authenticated,false);
  assert.equal(x.original_cropped_assets_included,false);assert.equal(x.operator_publication_approval,true);
  assert.ok(!Object.hasOwn(x,'reading_parent')&&!Object.hasOwn(x,'score')&&!Object.hasOwn(x,'points'));
 }
});
test('B07 exact4 fails closed if source, answer, option or rights are mutated',()=>{
 const fields=[[0,'stem','改寫'],[0,'options',['①錯誤','②錯誤','③錯誤']],[0,'answer','①'],
  [1,'source_pdf_sha256','bad'],[2,'source_pdf_bbox_pts_top_left',[0,0,0,0]],
  [3,'canonical_kp_id','sci_g04s1_02_01'],[3,'operator_publication_approval',false],
  [0,'rights_license_status','UNVERIFIED'],[1,'reading_parent','不得加入的閱讀全文']];
 for(const [i,key,value] of fields){const t=structuredClone(bank);t.blocks[i][key]=value;assert.throws(()=>validateAndConvertP12113B07Exact4(t,authority),/FAIL_CLOSED/,key)}
 const t=structuredClone(bank);t.blocks.push(t.blocks[0]);assert.throws(()=>validateAndConvertP12113B07Exact4(t,authority),/FAIL_CLOSED/);
});
test('B07 exact4 live R5 loader retains source B01 to B07 previous 3 and adds four',()=>{
 const s=readFileSync(new URL('../site/assets/js/historical-bank-ox-v6.mjs',import.meta.url),'utf8');
 assert.ok(s.includes('validateAndConvertP12113B07Exact4'));
 assert.ok(s.includes('...b06Native16.blocks,...b07LushangExact3.blocks,...b07Exact4.blocks'));
 for(const k of ['standaloneTf','standaloneChoice','contextGroups','answerSlots'])assert.ok(s.includes('+b07LushangExact3.'+k+'+b07Exact4.'+k));
 for(const n of ['b01Wende7','b02Native21','b03Native27','b04Native36','b05Native24','b06Native16'])assert.ok(s.includes('...'+n+'.blocks'));
});
