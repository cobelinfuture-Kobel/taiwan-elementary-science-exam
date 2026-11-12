import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {normalizeSlot}=require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const a=read('p12-g04s1-113-native5-originalpdf107-glyph-bbox-proof-v1.json');
const b=read('p12-g04s1-113-othernative4-exact-pdf-glyph-bbox56-v1.json');
const first=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json').original_source_records;
const pa=read('p12-g04s1-113-missing15-published-lineage-main-bbox-shardA-v1.json');
const pb=read('p12-g04s1-113-missing15-published-lineage-main-bbox-shardB-v1.json');
const decode=d=>d.groups.flatMap(g=>g.encoded_geometry.split(';').map((v,i)=>({
 id:normalizeSlot(g.source_id+'|'+g.section+'|'+g.type+'|'+String(i+1).padStart(3,'0')),
 pdfPage: g.pdf_page_1_based ?? 1,
 bbox:v.split('.').map(z=>parseInt(z,36)/100)})));
const A=decode(a),B=decode(b);
test('second four original PDFs have verified frozen exact file SHA evidence and valid 56 physical answer BBoxes',()=>{
  const reg=new Map(first.map(x=>[x.source_id,x.original_pdf_sha256]));
  assert.equal(b.original_pdfs.length,4);
  assert.equal(b.groups.length,6);
  assert.equal(B.length,56);
  for(const p of b.original_pdfs)assert.equal(p.source_pdf_sha256,reg.get(p.source_id));
  for(const s of B){
   assert.equal(s.pdfPage,1);
   assert.equal(s.bbox.length,4);
   assert.ok(s.bbox.every(Number.isFinite));
   assert.ok(s.bbox[0]>=0&&s.bbox[2]>s.bbox[0]&&s.bbox[1]>=0&&s.bbox[3]>s.bbox[1]);
   assert.ok(s.bbox[2]<1200&&s.bbox[3]<1200);
  }
});
test('full 163 exact PDF glyph BBox source identities unique and 26 main prior-public BBox parity',()=>{
  assert.equal(A.length,107);
  assert.equal(B.length,56);
  const geom=[...A,...B];
  const m=new Map(geom.map(x=>[x.id,x]));
  assert.equal(m.size,163);
  const matches=[...pa.rows,...pb.rows].filter(x=>m.has(normalizeSlot(x.original_source_slot_id)));
  assert.equal(matches.length,26);
  for(const x of matches){
   const row=m.get(normalizeSlot(x.original_source_slot_id));
   assert.equal(row.pdfPage,x.source_page_pdf_1_based);
   for(let j=0;j<4;j++)
    assert.ok(Math.abs(row.bbox[j]-x.actual_source_pdf_bbox_pts_top_left[j])<=0.11,
      x.original_source_slot_id+' bbox mismatch '+j);
  }
  assert.equal(b.summary.original_pdf_markers_bbox,56);
  assert.equal(b.summary.published_main_bbox_parity,7);
  assert.equal(b.summary.source_glyph_bbox_new_unpublished,49);
  assert.equal(b.summary.formal_new_science_kp,0);
  assert.equal(b.summary.admission_ready_new,0);
  assert.equal(b.summary.published_new,0);
});
