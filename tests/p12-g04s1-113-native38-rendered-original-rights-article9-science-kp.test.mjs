import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const x=read('p12-g04s1-113-native38-originalpdf-visual-rights-formal-science-kp-v1.json');
const f27=read('p12-g04s1-113-native46-focused27-science-unique-directkp-source-evidence-v1.json');
const f11=read('p12-g04s1-113-native46-next11-science-kp-source-evidence-plus8-exceptions-v1.json');
const first=read('p12-g04s1-113-native5-originalpdf107-glyph-bbox-proof-v1.json');
const second=read('p12-g04s1-113-othernative4-exact-pdf-glyph-bbox56-v1.json');
const dup=read('p12-g04s1-113-native59-all750-original-stem-collisions-and-legacylineage-v1.json');
const kp=JSON.parse(fs.readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8')).units
 .filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id));
const g=new Map([...first.groups,...second.groups].flatMap(z=>z.encoded_geometry.split(';').map((e,i)=>[
 z.source_id+'|'+z.section+'|'+z.type+'|'+String(i+1).padStart(3,'0'),
 e.split('.').map(v=>parseInt(v,36)/100)
])));
test('all 38 visual-accepted independent answer + canonical KP item identities match previous 27+11 source evidence',()=>{
 const original=new Set([...f27.records,...f11.records].map(a=>a.source_slot_id));
 const actual=new Set(x.records.map(a=>a.source_slot_id));
 assert.equal(actual.size,38);
 assert.deepEqual(actual,original);
 assert.equal(x.papers.length,8);
 assert.equal(new Set(x.papers.map(z=>z.sha)).size,8);
 assert.equal(new Set(kp).size,48);
 for(const row of x.records){
  assert.match(row.original_pdf_sha256,/^[a-f0-9]{64}$/);
  assert.equal(row.original_pdf_page_pdf_1_based,1);
  assert.deepEqual(row.exact_pdf_answer_glyph_bbox_top_left_pts.map(v=>Math.round(v*100)/100),
      g.get(row.source_slot_id).map(v=>Math.round(v*100)/100));
  assert.ok(kp.includes(row.direct_canonical_kp_id_verified));
  assert.ok(['T','F','1','2','3','4'].includes(row.science_unique_answer_verified));
  assert.equal(row.formal_science_kp_approved,true);
  assert.equal(row.admission_ready,false);
  assert.equal(row.published,false);
  assert.equal(row.operator_batch_final_release_manifest_approval,false);
 }
});
test('Article 9 question-text-only paths do not grant rights to external figures, teacher answer sheets or PDF distribution',()=>{
 for(const row of x.records){
  assert.equal(row.original_school_exam_identity_verified,true);
  assert.equal(row.original_native_exam_question_and_options_on_render_visually_accepted,true);
  assert.equal(row.required_original_publisher_or_thirdparty_image_in_question,false);
  assert.equal(row.rights.license_status,'REGULATED_EXAM_QUESTION_ART9');
  assert.equal(row.rights.regulated_exam_identity_verified,true);
  assert.equal(row.rights.third_party_content_clearance,'NO_THIRD_PARTY_COPY');
  assert.equal(row.rights.public_material_scope,'EXAM_QUESTION_TEXT_ONLY');
  assert.equal(row.rights.original_teacher_answer_text_excluded,true);
  assert.equal(row.rights.source_pdf_not_redistributed,true);
  assert.equal(row.rights.rights_gate_pass,true);
  assert.equal(row.original_school_regular_assessment_header_rendered_and_visually_accepted,true);
 }
 assert.equal(x.summary.school_regular_exam_text_article9_component_rights_pass,38);
 assert.equal(x.summary.formal_science_kp_approved_new,38);
 assert.equal(x.summary.admission_ready_new,0);
 assert.equal(x.summary.published_new,0);
});
test('all 13 already published original slots remain suppressed, eight unresolved cases stay out of 38',()=>{
 const out=new Set(dup.records.filter(z=>z.result==='SOURCE_LINEAGE_ONLY_DO_NOT_REPUBLISH'||['EXACT_SAME_ORIGINAL_TF','EXACT_SAME_MC_STEM_AND_OPTIONS','ONLY_OPTION_ORDER_CHANGED'].includes(z.duplicate_kind)).map(z=>z.unpublished113_source_slot_id));
 assert.equal(out.size,13);
 assert.ok(x.records.every(z=>!out.has(z.source_slot_id)));
 assert.equal(f11.remaining_exceptions.length,8);
 assert.ok(f11.remaining_exceptions.every(z=>!x.records.some(a=>a.source_slot_id===z.source_slot_id)));
});
