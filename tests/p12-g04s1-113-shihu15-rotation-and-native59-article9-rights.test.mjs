import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const shihu=read('p12-g04s1-113-shihu-final009-p1-15mc-original-rotated-raster-bbox-v1.json');
const source=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const rights=read('p12-g04s1-113-native59-article9-rights-component-preflight-v1.json');
const native59=read('p12-g04s1-113-native137-science-kp59-evidence-only-v1.json');
const dedup=read('p12-g04s1-113-native59-published499-semantic-dedup-source-watch-v1.json');
test('scan Shihu 15 source answers retain source raw pixels, 180deg rotation and exact display PDF transform, not OCR',()=>{
 const paper=source.original_source_records.find(x=>x.source_id===shihu.source_id);
 assert.ok(paper&&paper.scan_only_pdf);
 assert.equal(paper.original_pdf_sha256,shihu.original_pdf_sha256);
 assert.equal(shihu.rows.length,15);
 assert.equal(new Set(shihu.rows.map(x=>x.source_slot_id_provisional)).size,15);
 assert.deepEqual(shihu.rows.map(x=>x.printed_number),Array.from({length:15},(_,i)=>i+1));
 const W=3035,H=4299,sx=728.4/W,sy=1031.76/H;
 for(const x of shihu.rows){
   assert.equal(x.page_rotation_applied_degrees,180);
   assert.equal(x.source_pdf_page_1_based,1);
   assert.equal(x.admission_ready,false);
   const [x0,y0,x1,y1]=x.source_page_display_upright_pixel_bbox_px;
   const raw=x.original_raw_embedded_image_bbox_px;
   assert.deepEqual(raw,[W-x1,H-y1,W-x0,H-y0]);
   const v=[x0*sx,y0*sy,x1*sx,y1*sy];
   for(let j=0;j<4;j++)assert.ok(Math.abs(v[j]-x.source_page_pdf_bbox_after_rotation_pts_top_left[j])<0.04);
 }
 assert.equal(shihu.summary.aggregate_scan5_individual_BBoxes,38);
 assert.equal(shihu.summary.prior_scan5_positions_without_individual_bbox,224);
 assert.equal(shihu.summary.new_formal_science_kp_approved,0);
 assert.equal(shihu.summary.published_new,0);
});
test('native59 unchanged Article9 TEXT-only eligibility preflight does not clear teacher key, original images or public Rights Gate',()=>{
 assert.equal(rights.rows.length,59);
 const keys=new Set(native59.records.map(x=>x.source_slot_id));
 assert.ok(rights.rows.every(x=>keys.has(x.source_slot_id)));
 assert.equal(rights.summary.original_exam_source_papers,8);
 assert.equal(rights.summary.source_papers_with_native_school_header,6);
 assert.equal(rights.summary.source_papers_needing_native_header_further_visual_readback,2);
 for(const x of rights.rows){
   assert.equal(x.original_teacher_answers_excluded,true);
   assert.equal(x.original_thirdparty_images_or_articles_cleared,false);
   assert.equal(x.regulated_exam_identity_verified_for_release,false);
   assert.equal(x.rights_gate_passed,false);
   assert.equal(x.ready_for_student_bank,false);
 }
 assert.equal(rights.summary.rights_cleared_new,0);
 assert.equal(rights.summary.admission_ready_new,0);
 assert.equal(rights.summary.published_new,0);
 assert.equal(dedup.summary.confirmed_same_assertion_and_suppress_from_new_pool,3);
 assert.equal(dedup.summary.all_750_student_bank_semantic_gate_complete,false);
});
