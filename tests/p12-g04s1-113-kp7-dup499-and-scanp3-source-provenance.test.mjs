import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=(n)=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const src=read('p12-g04s1-113-native137-science-kp59-evidence-only-v1.json');
const kp=read('p12-g04s1-113-native59-kp7-original-source-focused-decisions-v1.json');
const dup=read('p12-g04s1-113-native59-published499-semantic-dedup-source-watch-v1.json');
const tf=read('p12-g04s1-113-heshun-mid002-page3-parent5-actual-pixel-geometry-v1.json');
const moon=read('p12-g04s1-113-heshun-mid002-p3-moonchart4-exact-raster-bboxes-holdscope-v1.json');
test('seven direct-KP source differences narrow to six evidence-grounded preferences and one unresolved HOLD',()=>{
 const eligible=new Set(src.records.map(x=>x.source_slot_id));
 assert.equal(kp.records.length,7);
 assert.equal(kp.records.filter(x=>x.focus_decision==='PREFERRED_DIRECT_KP').length,6);
 assert.equal(kp.records.filter(x=>x.focus_decision==='NO_UNAMBIGUOUS_DIRECT_KP_HOLD').length,1);
 const authority=JSON.parse(fs.readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
 const valid=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(valid.size,48);
 for(const x of kp.records){
  assert.ok(eligible.has(x.source_slot_id));
  assert.match(x.original_pdf_sha256,/^[0-9a-f]{64}$/);
  if(x.preferred_kp_from_original_question)assert.ok(valid.has(x.preferred_kp_from_original_question));
  assert.equal(x.formal_science_kp_approved,false);
  assert.equal(x.published,false);
 }
 assert.equal(kp.summary.formal_science_kp_approved_new,0);
});
test('confirmed semantic equivalents retain published original lineage but do not create 113 duplicates; watches stay unresolved',()=>{
 assert.equal(dup.records.length,10);
 assert.equal(new Set(dup.records.map(x=>x.unpublished_113_source_slot_id)).size,10);
 assert.equal(dup.records.filter(x=>x.status==='EXACT_SAME_ASSERTION').length,3);
 assert.equal(dup.records.filter(x=>x.status.startsWith('HIGH_SEMANTIC_RISK_')).length,7);
 assert.equal(dup.records.filter(x=>x.status==='HIGH_SEMANTIC_RISK_REQUIRES_OPTION_COMPARISON').length,6);
 assert.equal(dup.records.filter(x=>x.status==='HIGH_SEMANTIC_RISK_REQUIRES_ANSWER_CONTEXT').length,1);
 assert.equal(dup.summary.matched_public_source_blocks_screened,499);
 assert.equal(dup.summary.all_750_student_bank_semantic_gate_complete,false);
 for(const x of dup.records){
  assert.ok(src.records.some(y=>y.source_slot_id===x.unpublished_113_source_slot_id));
  const published=JSON.parse(fs.readFileSync(new URL('../'+x.main_question_bank_json,import.meta.url),'utf8'));
  assert.ok(published.blocks.some(b=>b.id===x.already_public_block_id));
  assert.equal(x.create_new_public_item,false);
  assert.equal(x.retained_source_lineage,true);
 }
 assert.equal(dup.summary.admission_ready_new,0);
 assert.equal(dup.summary.published_new,0);
});
test('9 actual image component rectangles on scan page3 map exactly from source image pixels to PDF and preserve parent scope',()=>{
 assert.equal(tf.records.length,5);
 assert.equal(moon.rows.length,4);
 const all=[...tf.records.map(x=>({id:x.provisional_source_slot_id,px:x.printed_answer_parentheses_union_pixels,pt:x.mapped_original_pdf_bbox_pts_top_left})),
 ...moon.rows.map(x=>({id:x.provisional_source_slot_id,px:x.original_scanned_open_close_parenthesis_bbox_px,pt:x.actual_mapped_pdf_bbox_top_left_pts}))];
 assert.equal(new Set(all.map(x=>x.id)).size,9);
 const sx=1190/4960,sy=841/3507;
 for(const r of all)for(let k=0;k<4;k++)assert.ok(Math.abs(r.px[k]*(k%2?sy:sx)-r.pt[k])<0.04);
 assert.equal(tf.summary.combined_verified_raster_answer_positions,19);
 assert.equal(moon.summary.current_total_individual_scan_answer_positions,23);
 assert.equal(moon.summary.remaining_individual_pixel_bbox_to_recover,239);
 assert.ok(moon.rows.every(x=>x.scope_status==='HOLD_SCOPE_MOON_POSITION_ELEVATION_NOT_DIRECT_113_FROZEN48KP'));
 assert.equal(moon.summary.formal_science_kp_approved_new,0);
 assert.equal(moon.summary.admission_ready_new,0);
});
