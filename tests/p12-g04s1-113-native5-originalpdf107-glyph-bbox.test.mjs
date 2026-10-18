import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {normalizeSlot}=require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const proof=read('p12-g04s1-113-native5-originalpdf107-glyph-bbox-proof-v1.json');
const native=read('p12-g04s1-113-missing15-native5-107-tfmc-text-anchor-readback-v1.json');
const work=read('p12-g04s1-113-native5-unpublished88-source-gate-worklist-v1.json');
const pubA=read('p12-g04s1-113-missing15-published-lineage-main-bbox-shardA-v1.json');
const pubB=read('p12-g04s1-113-missing15-published-lineage-main-bbox-shardB-v1.json');
const decode=()=>proof.groups.flatMap(g=>g.encoded_geometry.split(';').map((x,i)=>({
 source_slot_id:g.source_id+'|'+g.section+'|'+g.type+'|'+String(i+1).padStart(3,'0'),
 bbox:x.split('.').map(z=>Number((parseInt(z,36)/100).toFixed(2))),
 source_id:g.source_id,original_section:g.section
})));
const geometry=decode();
test('original raw-PDF glyph source BBoxes decode to exact 107 ordered marker slots (five checked PDF SHAs)',()=>{
 assert.equal(proof.source_papers.length,5);
 assert.equal(proof.groups.length,9);
 assert.equal(geometry.length,107);
 assert.equal(new Set(geometry.map(x=>normalizeSlot(x.source_slot_id))).size,107);
 const registered=new Map(native.records.map(x=>[x.source_id,x.registered_original_pdf_sha256]));
 for(const p of proof.source_papers){
   assert.equal(p.original_pdf_sha256,registered.get(p.source_id));
   assert.match(p.original_pdf_sha256,/^[a-f0-9]{64}$/);
 }
 for(const g of geometry){
  assert.equal(g.bbox.length,4);
  assert.ok(g.bbox.every(Number.isFinite));
  assert.ok(g.bbox[0]>=0&&g.bbox[1]>=0&&g.bbox[2]>g.bbox[0]&&g.bbox[3]>g.bbox[1]);
  assert.ok(g.bbox[2]<1200&&g.bbox[3]<1200);
 }
 const original=new Set(native.records.flatMap(p=>p.sections.flatMap(s=>s.markers.map(x=>normalizeSlot(x.provisional_native_source_id)))));
 assert.deepEqual(new Set(geometry.map(x=>normalizeSlot(x.source_slot_id))),original);
});
test('independently published main PDF glyph box parity: all 19 boxes <= 0.1pt, including Yongan marker ordinal',()=>{
 const m=new Map(geometry.map(g=>[normalizeSlot(g.source_slot_id),g]));
 const main=[...pubA.rows,...pubB.rows];
 const found=main.filter(p=>m.has(normalizeSlot(p.original_source_slot_id)));
 assert.equal(found.length,19);
 for(const p of found){
  const g=m.get(normalizeSlot(p.original_source_slot_id));
  assert.equal(p.source_page_pdf_1_based,1);
  for(let i=0;i<4;i++)
   assert.ok(Math.abs(g.bbox[i]-p.actual_source_pdf_bbox_pts_top_left[i])<=0.1001,
     p.original_source_slot_id+' bbox['+i+'] '+g.bbox[i]+' vs '+p.actual_source_pdf_bbox_pts_top_left[i]);
 }
});
test('88 source-only unpublished exact marker BBoxes remain on original admission gate (no student release)',()=>{
 const m=new Map(geometry.map(g=>[normalizeSlot(g.source_slot_id),g]));
 assert.equal(work.records.length,88);
 assert.ok(work.records.every(x=>m.has(normalizeSlot(x.printed_source_slot_id))));
 assert.equal(new Set(work.records.map(x=>normalizeSlot(x.printed_source_slot_id))).size,88);
 const pub=new Set([...pubA.rows,...pubB.rows].map(x=>normalizeSlot(x.original_source_slot_id)));
 assert.ok(work.records.every(x=>!pub.has(normalizeSlot(x.printed_source_slot_id))));
 assert.equal(proof.summary.unpublished_exact_marker_bbox_evidence,88);
 assert.equal(proof.summary.existing_main_same_bbox_parity,19);
 assert.equal(proof.summary.new_formal_Science_KP_approved,0);
 assert.equal(proof.summary.new_admission_ready,0);
 assert.equal(proof.summary.new_published,0);
});
