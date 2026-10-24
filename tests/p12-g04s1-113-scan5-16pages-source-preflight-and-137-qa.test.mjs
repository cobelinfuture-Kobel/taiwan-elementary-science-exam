import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const scan=read('p12-g04s1-113-scan5-16page-rotation-source-preflight-v1.json');
const src=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const newer=read('p12-g04s1-113-native137-fullsource-and-admission-deficit-checkpoint-v1.json');
test('five original scans retain known source binary SHAs, 16 pages and 262 prior section response positions',()=>{
 const source=new Map(src.original_source_records.map(x=>[x.source_id,x]));
 assert.equal(scan.scan_source_groups.length,5);
 assert.equal(scan.scan_source_groups.reduce((s,x)=>s+x[2],0),16);
 assert.equal(scan.scan_source_groups.reduce((s,x)=>s+x[3],0),262);
 for(const [id,sha,pages] of scan.scan_source_groups){
  const old=source.get(id);
  assert.ok(old?.scan_only_pdf);
  assert.equal(sha,old.original_pdf_sha256);
  assert.equal(pages,old.original_pdf_page_count);
 }
 assert.equal(scan.verified_original_page_count,16);
 assert.equal(scan.original_pdf_native_char_count,0);
 assert.equal(scan.new_individual_raster_bbox_verified,0);
 assert.equal(scan.formal_science_kp_approved_new,0);
 assert.equal(scan.admission_ready_new,0);
 assert.equal(scan.published_new,0);
});
test('post-native original PDF glyph evidence retains existing 26 public slots, holds 137 unapproved',()=>{
 assert.equal(newer.metrics.original_pdf_files,9);
 assert.equal(newer.metrics.original_answer_glyph_bboxes,163);
 assert.equal(newer.metrics.already_published_source_lineages_not_new,26);
 assert.equal(newer.metrics.unpublished_source_bboxes,137);
 assert.equal(newer.metrics.legacy_science_candidate_rows_reused,79);
 assert.equal(newer.metrics.no_legacy_model_row,58);
 assert.equal(newer.metrics.legacy_existing_science_hold,3);
 assert.equal(newer.metrics.science_kp_new_formally_approved,0);
 assert.equal(newer.metrics.admission_ready_new,0);
 assert.equal(newer.metrics.published_new,0);
});
