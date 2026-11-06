import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=(p)=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const root='data/review/p12-g04s1-113-all29-';
const source=load(root+'scan4-182-existing-raster-sourceid-bbox-parent-crosswalk-v1.json');
const before=load(root+'scan5-heshun-final001-mc008-unique-answer-hold-overlay-v1.json');
const after=load(root+'scan4-heshun-mid002-moonphase7-scope-hold-overlay-v1.json');
const baseline=load(root+'known-atomic-disjoint-source-ledger-v8.json');
const kp=load('site/data/authority/science-g03-g04-selector-v3.json');

test('7 moon-phase children are exactly existing original proof slots without direct G4S1 Frozen48 KP',()=>{
 assert.equal(after.exact_seven_original_source_slots.length,7);
 assert.equal(after.frozen_48_g4_s1_kp_titles_count,48);
 const kps=kp.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points);
 assert.equal(kps.length,48);
 assert.equal(kps.some(x=>/月相|月亮|月形|月球|朔|望|月週期/.test(x.title)),false);
 const seven=source.rows.filter(x=>x.source_paper_id==='SCI_G04_S1_113_MID_002'&&x.original_source_group==='S01|MOON');
 assert.equal(seven.length,7);
 const keyed=new Map(seven.map(x=>[x.source_slot_id,x]));
 for(const r of after.exact_seven_original_source_slots){
  const record=keyed.get(r.source_slot_id);
  assert.ok(record,r.source_slot_id);
  assert.equal(r.old_status,'UNREVIEWED');
  assert.equal(r.new_effective_status,'HOLD');
  assert.equal(r.existing_gate_failure,'NO_DIRECT_FROZEN48KP_LUNAR_PHASE');
  assert.equal(r.source_pdf_page_1based,record.source_pdf_page_1based);
  assert.deepEqual(r.original_source_response_region_bbox_pdf_points_top_left,record.original_source_response_region_bbox_pdf_points_top_left);
  assert.equal(r.prior_proof_ref,record.geometry_proof_file);
 }
 assert.equal(after.source_pdf_unchanged,true);
 assert.equal(after.authority_unchanged,true);
});

test('original 1762 work positions remain disjoint across prior one-question and seven-question exception overlays',()=>{
 assert.deepEqual(baseline.known_disjoint_dispositions,{PUBLISHED:333,HOLD:283,ALIAS:15,UNREVIEWED:1131});
 assert.deepEqual(after.before_effective_disjoint,before.effect_source_work_disjoint);
 const map=new Map(baseline.known_atomic_source_dispositions.map(x=>[x.source_slot_id,x.disposition]));
 assert.equal(map.size,1762);
 map.set(before.source_slot_id,'HOLD');
 for(const r of after.exact_seven_original_source_slots){
  assert.equal(map.get(r.source_slot_id),'UNREVIEWED');
  map.set(r.source_slot_id,'HOLD');
 }
 const counters={PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0};
 for(const v of map.values())counters[v]++;
 assert.deepEqual(counters,after.after_effective_disjoint);
 assert.deepEqual(counters,{PUBLISHED:333,HOLD:291,ALIAS:15,UNREVIEWED:1123});
 assert.equal(Object.values(counters).reduce((a,b)=>a+b,0),1762);
 const scanIds=new Set(['SCI_G04_S1_113_MID_002','SCI_G04_S1_113_FINAL_001','SCI_G04_S1_113_FINAL_002','SCI_G04_S1_113_MID_006','SCI_G04_S1_113_FINAL_009']);
 const fourIds=new Set([...scanIds].filter(x=>!x.endsWith('FINAL_001')));
 function stats(ids){
   const s={PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0};
   for(const x of baseline.known_atomic_source_dispositions)if(ids.has(x.paper_id))s[map.get(x.source_slot_id)]++;
   return s;
 }
 assert.deepEqual(stats(scanIds),after.scan5_after_effective_disjoint);
 assert.deepEqual(stats(fourIds),after.scan4_after_effective_disjoint);
 assert.equal(after.no_new_formal_science_kp_approved,0);
 assert.equal(after.no_new_admission_ready,0);
 assert.equal(after.no_new_published,0);
});
