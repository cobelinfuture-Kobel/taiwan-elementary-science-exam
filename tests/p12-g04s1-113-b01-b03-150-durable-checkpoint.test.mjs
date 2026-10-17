import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const load=x=>JSON.parse(fs.readFileSync('data/review/'+x,'utf8'));
const report=load('p12-g04s1-113-native-b01b02b03-150-source-closeout-checkpoint-v1.json');
const suppression=load('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
const source=[load('p12-g04s1-113-native-tfmc-b01-50-pdf-text-model-kp-preflight-v1.json').rows.map(x=>x.normalized_source_slot_id),
load('p12-g04s1-113-native-tfmc-b02-50-pdf-text-layer-source-qa-v2.json').source_positions.map(x=>x.source_slot_id),
load('p12-g04s1-113-native-tfmc-b03-50-original-pdf-text-preflight-v1.json').records.map(x=>x.source_slot_id)];
const box=[load('p12-g04s1-113-native-tfmc-b01-50-original-native-glyph-bbox-readback-v1.json').source_positions.map(x=>x.source_slot_id),
load('p12-g04s1-113-native-tfmc-b02-50-original-native-glyph-bbox-readback-v1.json').source_positions.map(x=>x.source_slot_id),
load('p12-g04s1-113-native-tfmc-b03-50-real-original-glyph-bbox-v1.json').source_marker_records.map(x=>x.original_source_slot_id)];
test('P12 113 native B01 B02 B03 150 durable text/glyph/source suppression parity',()=>{
 const items=source.flat();
 assert.equal(items.length,150);
 assert.equal(new Set(items).size,150);
 assert.deepEqual(items,box.flat());
 assert.deepEqual(items,build().lanes[0].batches.slice(0,3).flatMap(x=>x.source_slots.map(y=>y.normalized_source_slot_id)));
 assert.equal(report.metrics.native_tfmc_source_positions_processed,150);
 assert.equal(report.metrics.native_tfmc_positions_remaining,151);
 assert.equal(report.metrics.original_114_archive_source_rows_checked_for_B01_B02,717);
 assert.equal(report.metrics.public_113_original_sources_suppressed,114);
 assert.equal(report.metrics.existing_site_public_answer_slots,750);
 assert.equal(suppression.public_total_answer_slots,750);
 assert.equal(report.metrics.new_formal_science_kp_approved,0);
 assert.equal(report.metrics.new_admission_ready,0);
 assert.equal(report.metrics.new_published,0);
});
