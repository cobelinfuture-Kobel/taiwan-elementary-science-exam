import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const p=read('p12-g04s1-113-taozijiao-mid012-100-child-original-pdf-geometry-v1.json');
const u=read('p12-g04s1-113-all29-411-unique-question-review-union-v4.json');
const pub=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
test('original frozen Taozijiao mid source is 16 groups exactly 100 distinct same-SHA legacy subitems',()=>{
 const rows=u.rows.filter(x=>x.paper_id==='SCI_G04_S1_113_MID_012');
 assert.equal(p.records.length,100);
 assert.equal(rows.length,100);
 assert.equal(new Set(rows.map(x=>x.review_id)).size,100);
 assert.deepEqual(new Set(p.records.map(x=>x.source_slot_id)),new Set(rows.map(x=>x.review_id)));
 assert.ok(p.records.every(x=>x.original_full_stem_options_independently_certified_new===false));
 assert.ok(p.records.every(x=>x.formal_science_unique_answer_and_direct48kp_new===false));
 assert.ok(p.records.every(x=>x.admission_ready_new===false));
 assert.ok(rows.every(x=>x.pdf_sha256===p.original_source_pdf_sha256));
 assert.ok(!pub.all_unique_published_source_slot_ids.some(x=>x.startsWith('SCI_G04_S1_113_MID_012|')));
});
test('86 native original PDF physical bracket glyphs, 14 figure-linked unchanged and 4 old science holds',()=>{
 const geos=p.records.filter(x=>x.original_page_bbox_pts_top_left!==null);
 assert.equal(geos.length,86);
 assert.equal(p.records.filter(x=>x.original_page_bbox_pts_top_left===null).length,14);
 assert.ok(p.records.filter(x=>x.original_page_bbox_pts_top_left===null).every(x=>[5,6].includes(x.original_printed_group)));
 const q=(n)=>p.records.filter(x=>x.original_printed_group===n);
 assert.equal(q(5).length,8);assert.equal(q(6).length,6);
 assert.equal(q(11).length,6);assert.ok(q(11).every(x=>x.parent_figure_dependency));
 assert.equal(q(16).length,5);assert.ok(q(16).every(x=>x.third_party_reading_source_dependency));
 for(const x of geos){
  assert.equal(x.original_page_bbox_pts_top_left.length,4);
  const v=x.original_page_bbox_pts_top_left;
  assert.ok(v.every(Number.isFinite));
  assert.ok(v[0]>=0&&v[1]>=0&&v[2]>v[0]&&v[3]>v[1]);
  assert.ok(v[2]<729&&v[3]<1032);
  assert.equal(x.answer_glyph_geometry_source,'ORIGINAL_SHA256_VERIFIED_RAWDICT_ACTUAL_PRINTED_ANSWER_BRACKET');
 }
 const holds=p.records.filter(x=>x.historical_science_status==='SCIENCE_HOLD');
 assert.equal(holds.length,4);
 assert.equal(p.summary.historical_science_holds_preserved,4);
 assert.equal(p.summary.new_formal_science_kp_approved,0);
 assert.equal(p.summary.new_admission_ready,0);
 assert.equal(p.summary.new_published,0);
});
