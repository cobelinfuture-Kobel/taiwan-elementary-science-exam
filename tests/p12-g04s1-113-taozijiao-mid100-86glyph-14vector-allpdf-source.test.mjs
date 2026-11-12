import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const native=read('p12-g04s1-113-taozijiao-mid012-100-child-original-pdf-geometry-v1.json');
const vector=read('p12-g04s1-113-taozijiao-mid012-14-original-vector-blank-bboxes-v1.json');
test('100 original printed answer positions have actual PDF BBoxes from native text or vector path (86+14)',()=>{
  assert.equal(native.records.length,100);
  assert.equal(vector.records.length,14);
  const n=native.records.filter(x=>x.original_page_bbox_pts_top_left!==null);
  const v=new Map(vector.records.map(x=>[x.source_slot_id,x]));
  assert.equal(n.length,86);
  assert.equal(v.size,14);
  const all=new Set(native.records.map(x=>x.source_slot_id));
  assert.ok(vector.records.every(x=>all.has(x.source_slot_id)));
  assert.ok(vector.records.every(x=>native.records.find(n=>n.source_slot_id===x.source_slot_id).original_page_bbox_pts_top_left===null));
  const union=new Set([...n.map(x=>x.source_slot_id),...v.keys()]);
  assert.equal(union.size,100);
  assert.deepEqual(union,all);
  assert.equal(vector.original_pdf_sha256,native.original_source_pdf_sha256);
  for(const x of vector.records){
    assert.equal(x.source_page_pdf_1_based,1);
    assert.match(x.source_geometry_evidence,/ALL_FOUR_SIDES/);
    assert.equal(x.original_pdf_vector_response_cell_bbox_pts_top_left.length,4);
    const [x0,y0,x1,y1]=x.original_pdf_vector_response_cell_bbox_pts_top_left;
    assert.ok(x1>x0&&y1>y0);
    assert.ok(x0>=0&&y0>=0&&x1<729&&y1<1032);
    assert.equal(x.image_redistribution_rights,'UNVERIFIED_HOLD');
    assert.equal(x.publication_ready,false);
  }
});
test('14 exact vector positions preserve original parent grid and historical Science HOLDs',()=>{
 const q5=vector.records.filter(x=>x.source_slot_id.includes('|S05|'));
 const q6=vector.records.filter(x=>x.source_slot_id.includes('|S06|'));
 assert.equal(q5.length,8);assert.equal(q6.length,6);
 assert.deepEqual(q5.map(x=>x.original_pdf_vector_response_cell_bbox_pts_top_left[1]),[792.22,792.22,792.22,792.22,882.36,882.36,882.36,882.36]);
 assert.ok(q6.every(x=>x.original_pdf_vector_response_cell_bbox_pts_top_left[1]===145.94));
 assert.equal(native.records.filter(x=>x.historical_science_status==='SCIENCE_HOLD').length,4);
 assert.equal(vector.summary.combined_original_response_source_geometry,100);
 assert.equal(vector.summary.new_formal_science_kp_approved,0);
 assert.equal(vector.summary.new_admission_ready,0);
 assert.equal(vector.summary.new_published,0);
});
