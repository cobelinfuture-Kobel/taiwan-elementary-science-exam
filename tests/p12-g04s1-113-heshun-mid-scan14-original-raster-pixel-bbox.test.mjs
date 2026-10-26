import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const mc=read('p12-g04s1-113-heshun-mid002-scanned-sixmc-actual-pixel-geometry-v1.json');
const tf=read('p12-g04s1-113-heshun-mid002-scan-eightTF-actual-pixel-geometry-v1.json');
const src=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const reg=src.original_source_records.find(x=>x.source_id==='SCI_G04_S1_113_MID_002');
const all=[...mc.records,...tf.records];
test('source original PDF is scan SHA-matched, 6 printed MC + 8 printed TF physical pixel answer brackets have unique IDs',()=>{
 assert.ok(reg.scan_only_pdf);
 assert.equal(reg.original_pdf_sha256,mc.source_pdf_sha256);
 assert.equal(reg.original_pdf_sha256,tf.source_original_sha256);
 assert.equal(all.length,14);
 assert.equal(new Set(all.map(x=>x.source_slot_id)).size,14);
 assert.deepEqual(mc.records.map(x=>x.source_slot_id),
  Array.from({length:6},(_,i)=>'SCI_G04_S1_113_MID_002|S02|MC|'+String(i+1).padStart(3,'0')));
 assert.deepEqual(tf.records.map(x=>x.source_slot_id),
  Array.from({length:8},(_,i)=>'SCI_G04_S1_113_MID_002|S03|TF|'+String(i+1).padStart(3,'0')));
});
test('each original raster bbox in 4960×3507 fits its actually printed PDF page mapping within 0.03pt',()=>{
 const sx=1190/4960,sy=841/3507;
 for(const x of mc.records){
   const pix=x.exact_original_raster_parenthesis_bbox_px_top_left;
   const pt=x.mapped_original_pdf_bbox_pts_top_left;
   assert.equal(pix.length,4);assert.equal(pt.length,4);
   for(let i=0;i<4;i++)assert.ok(Math.abs(pix[i]*(i%2?sy:sx)-pt[i])<=0.03);
   assert.ok(pix[2]>pix[0]&&pix[3]>pix[1]);
   assert.equal(x.recognized_by_ocr,false);
   assert.equal(x.admission_ready,false);
 }
 for(const x of tf.records){
   const pix=x.actual_open_and_close_parenthesis_union_pixel_bbox,pt=x.mapped_pdf_page_bbox_pts_topleft;
   assert.equal(pix.length,4);assert.equal(pt.length,4);
   assert.equal(x.source_page_pdf_1_based,2);
   for(let i=0;i<4;i++)assert.ok(Math.abs(pix[i]*(i%2?sy:sx)-pt[i])<=0.03);
   assert.ok(pix[2]>pix[0]&&pix[3]>pix[1]);
   assert.equal(x.no_ocr,true);
   assert.equal(x.admission_ready,false);
 }
});
test('scan five total remains 262 frozen section positions, not 262 certified individual raster pixels',()=>{
 assert.equal(mc.summary.existing_stage2_scan_section_source_count,undefined);
 assert.equal(mc.summary.source_individual_raster_bbox_new,6);
 assert.equal(tf.summary.newly_exact_raster_tf_slots,8);
 assert.equal(tf.summary.total_original_scan_answer_pixel_bboxes_now,14);
 assert.equal(tf.summary.remaining_original_scan_answer_positions_without_exact_bbox,248);
 assert.equal(tf.summary.formal_science_kp_approved_new,0);
 assert.equal(tf.summary.admission_ready_new,0);
 assert.equal(tf.summary.published_new,0);
});
