import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r=name=>JSON.parse(readFileSync(new URL('../data/review/'+name,import.meta.url),'utf8'));
const x=r('p12-g04s1-113-p04b-remaining12-original-drive-text-preflight-v1.json');
const cp=r('p12-g04s1-113-p04b-inherited3-scan-raster162-active17-resume-v3.json');
const reg=r('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
test('remaining 12 original sources have exact frozen registry identity, native Drive text preflight separated from scan raster QA',()=>{
 const known=new Map(reg.original_source_records.map(y=>[y.source_id,y]));
 assert.equal(x.remaining_papers,12);
 assert.equal(x.remaining_text_layer_papers_direct_readback,10);
 assert.equal(x.remaining_scan_only_papers_requiring_raster_original_visual,2);
 assert.equal(x.paper_source_preflight.length,12);
 assert.deepEqual(x.paper_source_preflight.map(y=>y.paper_id),cp.remaining_paper_ids);
 for(const y of x.paper_source_preflight){
  const k=known.get(y.paper_id);
  assert.ok(k);
  assert.equal(y.original_pdf_sha256,k.original_pdf_sha256);
  assert.equal(y.original_pdf_pages,k.original_pdf_page_count);
  assert.equal(y.scan_only,k.scan_only_pdf);
  assert.equal(y.requires_actual_original_visual_response_and_parent_qa,true);
  if(y.scan_only){
   assert.equal(y.text_direct_original_drive_readback,'NOT_POSSIBLE_SCAN_ONLY');
   assert.equal(y.extracted_text_char_count,null);
  } else {
   assert.equal(y.text_direct_original_drive_readback,'SUCCESS');
   assert.ok(y.extracted_text_char_count>1000);
   assert.ok(y.original_pdf_section_headings_text_only.length>=3);
  }
 }
 assert.equal(x.paper_source_preflight.filter(y=>y.scan_only).length,2);
 assert.equal(x.paper_source_preflight.filter(y=>y.text_direct_original_drive_readback==='SUCCESS').length,10);
 assert.equal(x.current_itemized_source_geometry_papers,17);
 assert.equal(x.current_itemized_source_position_evidence,954);
 for(const a of ['FORMAL_SCIENCE_KP_APPROVED_new','ADMISSION_READY_new','PUBLISHED_new']) assert.equal(x[a],0);
 assert.equal(x.no_new_pdf_binary_SHA_verification_claim,true);
});
