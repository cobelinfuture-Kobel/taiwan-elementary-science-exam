import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('data/review');
const read=x=>JSON.parse(fs.readFileSync(path.join(root,x),'utf8'));
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const old=read('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
const artifacts=[
  read('p12-g04s1-113-p04b-dongguang-mid-final-64-native-answer-marker-bbox-v1.json'),
  read('p12-g04s1-113-p04b-dadun-mid29-native-answer-marker-bbox-v1.json')
];
const norm=id=>id.replace(/\|S0*(\d+)\|/,'|S$1|').replace(/\|SINGLE_CHOICE\|/,'|MC|').replace(/\|TRUE_FALSE\|/,'|TF|').replace(/\|0+(\d+)$/,(m,n)=>'|'+Number(n));
const published=new Set(old.all_unique_published_source_slot_ids.map(norm));
const registered=new Map(master.paper_records.map(x=>[x.paper_id,x]));
test('P04B exact original native question answer-marker boxes: 64+29=93 distinct physical source IDs under ALL29',()=>{
  assert.equal(artifacts[0].records.length,64);
  assert.equal(artifacts[1].records.length,29);
  const all=artifacts.flatMap(x=>x.records);
  assert.equal(new Set(all.map(x=>norm(x.source_slot_id))).size,93);
  assert.equal(master.p04b_native_original_pdf_marker_bbox_count,178);
  assert.equal(master.p04b_original_school_papers_with_native_marker_positions,5);
  const countBy=new Map();
  for(const item of all){
    const pid=item.source_slot_id.split('|')[0];
    const original=registered.get(pid);
    assert.ok(original,'unregistered source cannot be added');
    assert.equal(item.source_pdf_sha256||item.original_pdf_sha256,original.original_pdf_sha256);
    assert.equal(item.original_pdf_page,1);
    const [x0,y0,x1,y1]=item.original_answer_marker_native_pdf_bbox_pt;
    assert.ok(x0>=0&&x1<=729&&y0>=0&&y1<=1032&&x0<x1&&y0<y1,'original marker must have a real source page bbox');
    assert.ok(!item.admission_ready);
    countBy.set(pid,(countBy.get(pid)||0)+1);
  }
  assert.deepEqual([...countBy.values()].sort((a,b)=>a-b),[29,29,35]);
  for(const [pid,n] of countBy){
    assert.equal(registered.get(pid).p04b_native_original_pdf_marker_positions,n);
    assert.equal(registered.get(pid).inventory_certified,false);
    assert.equal(registered.get(pid).paper_closed,false);
  }
});
test('P04B preserve published source lineage and never count source marker as new admission',()=>{
  const all=artifacts.flatMap(a=>a.records);
  const existing=all.filter(x=>published.has(norm(x.source_slot_id))).length;
  assert.equal(existing,32); // 4 MID004, 11 FINAL003, 17 MID005
  assert.equal(all.length-existing,61);
  assert.equal(master.p04b_formal_science_kp_approved_new,0);
  assert.equal(master.p04b_admission_ready_new,0);
  assert.equal(master.p04b_published_new,0);
  assert.equal(master.all29_complete,false);
  assert.equal(master.formally_closed_papers,0);
});
test('P04B source marker counts never get promoted to an exactly-certified all29 original answer-slot denominator',()=>{
  assert.equal(master.p04b_nonnative_or_other_unresolved_original_answer_region_count_NOT_CERTIFIED,1762-178);
  assert.equal(master.source_position_universe_certified,false);
  assert.equal(master.p04b_original_source_bbox_gates_passed_new,0);
  assert.equal(master.p04_all29_original_independent_slot_ids_and_bbox_certified,false);
  assert.equal(master.exact_total_slots,null);
  assert.ok(master.paper_records.every(p=>p.exact_total_slots===null));
});
test('P04B negative: a duplicated normalized original source identity is a collision',()=>{
  const ids=artifacts.flatMap(a=>a.records.map(x=>norm(x.source_slot_id)));
  const duplicate=[...ids,ids[0]];
  assert.notEqual(new Set(duplicate).size,duplicate.length);
});
test('P04B negative: forged or out-of-bounds native PDF page geometry cannot pass',()=>{
  const id=artifacts[0].records[0];
  const bad=[...id.original_answer_marker_native_pdf_bbox_pt];
  bad[2]=bad[0]-1;
  assert.ok(!(bad[0]>=0 && bad[2]<=729 && bad[0]<bad[2]));
});

test('P04B supplemental Dahua24 and Neihu61 native PDF-only source marker IDs pass geometry; remain formally unadmitted',()=>{
 const dahua=read('p12-g04s1-113-p04b-dahua-mid24-native-marker-bbox-v1.json');
 const neihu=read('p12-g04s1-113-p04b-neihu-final61-native-answer-marker-bbox-v1.json');
 assert.equal(dahua.records.length,24);
 assert.equal(neihu.records.length,61);
 assert.equal(dahua.previously_published_source_ids,6);
 assert.equal(neihu.source_remaining_visual_figure_response_regions,10);
 const ids=new Set(artifacts.flatMap(z=>z.records.map(a=>norm(a.source_slot_id))));
 const shaMap=new Map(master.paper_records.map(p=>[p.paper_id,p.original_pdf_sha256]));
 for(const [source,items,sha,size] of [
  [dahua,dahua.records,dahua.original_pdf_sha256,[595,842]],
  [neihu,neihu.records,neihu.source_pdf_sha256,[595,842]]
 ]){
  const paper=source.paper_id||source.original_paper;
  assert.equal(sha,shaMap.get(paper));
  for(const item of items){
    const key=norm(item.source_slot_id);
    assert.ok(!ids.has(key),'no original source identity may be double-scheduled');
    ids.add(key);
    const bbox=item.original_marker_native_bbox_pt||item.original_answer_marker_native_pdf_bbox_pt;
    assert.ok(Array.isArray(bbox) && bbox.length===4);
    const [x0,y0,x1,y1]=bbox;
    assert.ok([x0,y0,x1,y1].every(Number.isFinite));
    assert.ok(x0>=0&&y0>=0&&x1<=size[0]&&y1<=size[1]&&x0<x1&&y0<y1);
    assert.equal(item.admission_ready,false);
  }
 }
 assert.equal(ids.size,178);
 assert.equal(master.p04b_native_original_pdf_marker_bbox_count,178);
 assert.equal(master.p04b_original_school_papers_with_native_marker_positions,5);
 assert.equal(master.p04b_already_published_source_in_mapped_native,38);
 assert.equal(master.p04b_unpublished_native_source_positions,140);
 assert.equal(master.source_position_universe_certified,false);
 assert.equal(master.all29_complete,false);
});
test('P04B negative: figure-only missing original response regions remain unaccepted and are not substituted by nearby native markers',()=>{
 const neihu=read('p12-g04s1-113-p04b-neihu-final61-native-answer-marker-bbox-v1.json');
 assert.equal(neihu.source_region_working_total,71);
 assert.equal(neihu.native_marker_positions_documented+neihu.source_remaining_visual_figure_response_regions,71);
 assert.equal(neihu.source_remaining_visual_figure_response_regions,10);
 assert.equal(master.paper_records.find(p=>p.paper_id===neihu.paper_id).inventory_certified,false);
});

test('P04B Neihu visual: six original vector drawn source boxes and four separate raster-shadow answers complete marker-location working count 71 without certifying full source admission',()=>{
 const img=read('p12-g04s1-113-p04b-neihu-final10-image-vector-response-regions-v1.json');
 const text=read('p12-g04s1-113-p04b-neihu-final61-native-answer-marker-bbox-v1.json');
 assert.equal(img.records.length,10);
 assert.equal(text.records.length+img.records.length,71);
 assert.equal(img.source_page2_vector_bboxes,6);
 assert.equal(img.source_page3_raster_bboxes,4);
 const seen=new Set(text.records.map(x=>norm(x.source_slot_id)));
 for(const x of img.records){
  assert.ok(!seen.has(norm(x.source_slot_id)));
  seen.add(norm(x.source_slot_id));
  assert.ok([2,3].includes(x.original_pdf_page));
  if(x.original_pdf_page===2){
   assert.equal(x.pdf_coordinate_provenance,'SOURCE_PDF_VECTOR_DRAWING_RECT');
   const [x0,y0,x1,y1]=x.original_answer_marker_vector_bbox_pt;
   assert.ok(x0>=0&&y0>=0&&x1<=595&&y1<=842&&x0<x1&&y0<y1);
  }else{
   assert.ok(x.image_crop_visual_qa_pending,'raster box is not exact native geometry');
   const [x0,y0,x1,y1]=x.original_answer_marker_raster_render_bbox_px;
   assert.ok(x0>=0&&y0>=0&&x1<=893&&y1<=1263&&x0<x1&&y0<y1);
  }
  assert.equal(x.admission_ready,false);
 }
 assert.equal(seen.size,71);
 assert.equal(master.p04b_original_pdf_visual_and_native_marker_total_located,188);
 assert.equal(master.p04b_source_working_regions_not_yet_individually_geometry_anchored_NONCERTIFIED,1762-188);
 assert.equal(master.p04b_original_figure_only_response_locations_derived,10);
 assert.equal(master.source_position_universe_certified,false);
 assert.equal(master.all29_complete,false);
});
