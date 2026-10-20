import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r = n => JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const v3=r('p12-g04s1-113-p04b-inherited3-scan-raster162-active17-resume-v3.json');
const v2=r('p12-g04s1-113-p04b-inherited2-itemized14-remaining15-source-resume-v2.json');
const reg=r('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const master=r('p12-g04s1-113-all29-master-ledger-v1.json');

test('P04B inherited scan source IDs conserve 29 original PDF scope without new admission',()=>{
 assert.equal(v2.active_source_ids_itemized_papers,14);
 assert.equal(v3.source_itemized_original_papers_current,17);
 assert.equal(v3.source_itemized_response_ids_current,954);
 assert.equal(v3.source_original_scan_papers_inherited_new,3);
 assert.equal(v3.source_original_raster_answer_markers_inherited_new,162);
 assert.equal(v3.remaining_papers_need_source_ID_enumeration,12);
 assert.equal(v3.remaining_original_pdf_pages,32);
 assert.equal(v3.remaining_working_section_response_regions_NONCERTIFIED,808);
 assert.equal(v3.all29_working_section_response_regions_NONCERTIFIED,1762);
 assert.equal(v3.formally_closed_papers,0);
 for (const x of ['FORMAL_SCIENCE_KP_APPROVED_new','ADMISSION_READY_new','PUBLISHED_new']) assert.equal(v3[x],0);
 assert.equal(v3.existing_113_published_source_positions_unchanged,178);
 assert.equal(v3.source_papers.length,3);
 assert.deepEqual(v3.source_papers.map(x=>x.source_IDs_itemized_and_original_raster_BBox_verified),[50,50,62]);
 assert.equal(v3.source_itemized_response_ids_current,v2.active_source_ids_itemized_records+v3.source_original_raster_answer_markers_inherited_new);
});

test('P04B exact 162 original scan answer-marker geometries are ID unique, PDF page bounded, original SHA equal',()=>{
 const known=new Map(reg.original_source_records.map(x=>[x.source_id,x]));
 const source=new Map(master.paper_records.map(x=>[x.paper_id,x]));
 let sum=0,ids=new Set();
 for(const p of v3.source_papers){
  assert.equal(p.original_pdf_sha256,known.get(p.paper_id).original_pdf_sha256);
  assert.equal(p.original_pdf_pages,known.get(p.paper_id).original_pdf_page_count);
  assert.equal(p.source_IDs_itemized_and_original_raster_BBox_verified,source.get(p.paper_id).section_reconciled_positions);
  assert.equal(p.records.length,p.source_IDs_itemized_and_original_raster_BBox_verified);
  assert.equal(p.already_published_source_ids_retained,source.get(p.paper_id).published_count);
  assert.equal(p.formal_full_paper_source_gate_accepted,false);
  for(const row of p.records){
   assert.ok(row.source_slot_id_provisional.startsWith(p.paper_id+'|'));
   assert.ok(!ids.has(row.source_slot_id_provisional), 'duplicate source ID '+row.source_slot_id_provisional);
   ids.add(row.source_slot_id_provisional);
   assert.ok(Number.isInteger(row.pdf_page) && row.pdf_page>=1 && row.pdf_page<=p.original_pdf_pages);
   const b=row.original_source_raster_answer_bbox_pdf_pts;
   assert.ok(Array.isArray(b) && b.length===4 && b.every(Number.isFinite));
   assert.ok(b[0]>=0&&b[1]>=0&&b[2]>b[0]&&b[3]>b[1]);
   assert.equal(row.original_answer_marker_geometry_verified,true);
   assert.equal(row.full_parent_text_figures_science_kp_rights_pending,true);
   assert.equal(row.ADMISSION_READY,false);
   sum++;
  }
 }
 assert.equal(ids.size,162);
 assert.equal(sum,162);
 const inherited=new Set(v3.source_papers.map(x=>x.paper_id));
 assert.ok(inherited.size===3 && [...inherited].every(id=>v2.remaining_original_papers_in_original_registry_order.some(x=>x.paper_id===id)));
});

test('P04B remaining 12 / 32-page source papers equal prior 15 minus scanned three',()=>{
 const current = new Set(v3.remaining_paper_ids);
 assert.equal(current.size,12);
 assert.deepEqual(v3.remaining_paper_ids,v2.remaining_original_papers_in_original_registry_order.filter(x=>!v3.source_papers.some(p=>p.paper_id===x.paper_id)).map(x=>x.paper_id));
 const rows=v2.remaining_original_papers_in_original_registry_order.filter(x=>current.has(x.paper_id));
 assert.equal(rows.reduce((a,x)=>a+x.original_pdf_pages,0),32);
 assert.equal(rows.reduce((a,x)=>a+x.working_section_response_regions_NONCERTIFIED,0),808);
 assert.equal(v3.source_itemized_response_ids_current+v3.remaining_working_section_response_regions_NONCERTIFIED,1762);
 assert.equal(v3.all29_exact_independent_answer_universe_certified,false);
});
