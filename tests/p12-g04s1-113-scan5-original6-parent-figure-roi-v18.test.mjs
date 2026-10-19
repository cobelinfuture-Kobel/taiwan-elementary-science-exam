import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const current=read('p12-g04s1-113-scan5-remaining6-actual-original-parent-figure-rois-v18.json');
const prior=read('p12-g04s1-113-scan5-source-marker-progress256-of262-v17.json');
const pub=read('p12-g04s1-113-main-published174-source-suppression-readback-v11.json');
const reg=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const refs=new Map(reg.original_source_records.map(x=>[x.source_id,x]));
const approx=(x,y)=>assert.ok(Math.abs(x-y)<=0.55,'expected '+x+' ≈ '+y);

test('original scanned six figure/table parent regions localize without inventing independent answer boxes or admission',()=>{
 assert.equal(current.records.length,6);
 assert.equal(current.records.filter(x=>x.source_id==='SCI_G04_S1_113_FINAL_002').length,4);
 assert.equal(current.records.filter(x=>x.source_id==='SCI_G04_S1_113_FINAL_009').length,2);
 assert.equal(current.new_parent_figure_visual_ROIs_localized,6);
 assert.equal(current.new_independent_printed_answer_bboxes_certified,0);
 assert.equal(current.current_source_marker_verified_including_6_partial_matching_dots,256);
 assert.equal(current.previous_independent_answer_bboxes_verified,250);
 assert.equal(current.unresolved_position_count_unchanged,6);
 assert.equal(prior.registered_section_response_positions,262);
 assert.equal(current.unresolved_original6_partition.zhongxiao_4_drawing_on_original_figure,4);
 assert.equal(current.unresolved_original6_partition.shihu_parent7_two_table_row_units,2);
 assert.equal(current.all_six_parent_ROIs_are_HOLD,true);
 assert.equal(current.source_pdf_images_copied_into_student_site,false);
 assert.equal(current.formal_progress.PUBLISHED_new,0);
 assert.equal(current.formal_progress.ADMISSION_READY_new,0);
 assert.equal(current.formal_progress.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(current.formal_progress.PUBLISHED_total_113,174);
 assert.equal(current.formal_progress.public_site_all_scopes_answer_slots,810);
 assert.equal(pub.all_unique_published_source_slot_ids.length,174);
 assert.equal(new Set(current.records.map(x=>x.source_slot_id_provisional)).size,6);
});

test('six actual original SHA-matched parent source image ROI transformations respect PDF page rotation and never become independent student answers',()=>{
 for(const x of current.records){
  const source=refs.get(x.source_id);
  assert.ok(source);
  assert.equal(source.original_pdf_sha256,x.original_pdf_sha256);
  assert.equal(source.scan_only_pdf,true);
  assert.ok(Number.isInteger(x.page)&&x.page<=source.original_pdf_page_count);
  assert.ok(Number.isInteger(x.xref)&&x.xref>0);
  assert.equal(x.source_raster_image_source_verified,true);
  assert.equal(x.parent_figure_roi_visually_grounded,true);
  assert.equal(x.parent_figure_roi_is_NOT_independent_answer_bbox,true);
  assert.equal(x.formal_answer_bbox_certified,false);
  assert.equal(x.third_party_figure_publication_cleared,false);
  assert.equal(x.figure_rights_cleared_for_public_copy,false);
  assert.equal(x.source_ocr_used,false);
  assert.equal(x.science_unique_answer_formal,false);
  assert.equal(x.canonical_kp_formal,false);
  assert.equal(x.ADMISSION_READY,false);
  assert.equal(x.PUBLISHED,false);
  assert.equal(x.student_content_dependency?.length>5,true);
  const [ux0,uy0,ux1,uy1]=x.upright_parent_figure_bbox_px;
  const [rx0,ry0,rx1,ry1]=x.embedded_raw_figure_bbox_px;
  const [px0,py0,px1,py1]=x.source_pdf_parent_roi_bbox_pts_top_left;
  const [pW,pH]=x.source_pdf_page_size_pts;
  assert.ok(ux0>=0&&uy0>=0&&ux1>ux0&&uy1>uy0&&rx1>rx0&&ry1>ry0);
  assert.ok(px0>=0&&py0>=0&&px1<=pW&&py1<=pH&&px1>px0&&py1>py0);
  if(x.source_id==='SCI_G04_S1_113_FINAL_002'){
    assert.deepEqual(x.upright_dimensions_px,[3507,4960]);
    assert.deepEqual(x.source_pdf_page_size_pts,[1190.52,841.8]);
    if(x.page===1){
      assert.equal(x.rotation,270);assert.equal(x.xref,8);
      assert.deepEqual([rx0,ry0,rx1,ry1],[uy0,3507-ux1,uy1,3507-ux0]);
    }else{
      assert.equal(x.rotation,90);assert.equal(x.xref,14);
      assert.deepEqual([rx0,ry0,rx1,ry1],[4960-uy1,ux0,4960-uy0,ux1]);
    }
    for(const [got,expect] of [[px0,rx0*pW/4960],[py0,ry0*pH/3507],[px1,rx1*pW/4960],[py1,ry1*pH/3507]])approx(got,expect);
  }else{
    assert.equal(x.page,3);assert.equal(x.xref,9);assert.equal(x.rotation,180);
    assert.deepEqual(x.upright_dimensions_px,[3035,4299]);
    assert.deepEqual([rx0,ry0,rx1,ry1],[3035-ux1,4299-uy1,3035-ux0,4299-uy0]);
    for(const [got,expect] of [[px0,ux0*pW/3035],[py0,uy0*pH/4299],[px1,ux1*pW/3035],[py1,uy1*pH/4299]])approx(got,expect);
  }
 }
});
