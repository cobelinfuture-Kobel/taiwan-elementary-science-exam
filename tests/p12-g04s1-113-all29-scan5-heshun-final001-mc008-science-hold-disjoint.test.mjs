import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const f='data/review/p12-g04s1-113-all29-';
const original=read(f+'known-atomic-disjoint-source-ledger-v8.json');
const visual=read(f+'scan5-heshun-final001-41-visual-parent-source-routing-v1.json');
const patch=read(f+'scan5-heshun-final001-mc008-unique-answer-hold-overlay-v1.json');
const wanted='SCI_G04_S1_113_FINAL_001|S02|MC|008';

test('one original-school multiple-answer LED question moves UNREVIEWED to HOLD, not PUBLISHED',()=>{
 assert.equal(patch.source_slot_id,wanted);
 assert.equal(patch.previous_disposition,'UNREVIEWED');
 assert.equal(patch.new_effective_disposition,'HOLD');
 assert.equal(patch.unique_answer_satisfied,false);
 assert.equal(patch.existing_gate_reason,'HOLD_SCIENCE_UNIQUE_ANSWER_MULTIPLE_INDIVIDUAL_CORRECT_OPTIONS');
 assert.deepEqual(patch.source_choice_check_facts.filter(x=>x.scientific_benefit).map(x=>x.ordinal),[1,3]);
 assert.deepEqual(original.known_disjoint_dispositions,patch.previous_source_work_disjoint);
 const baseline=original.known_atomic_source_dispositions.find(z=>z.source_slot_id===wanted);
 assert.equal(baseline.disposition,'UNREVIEWED');
 const proof=visual.rows.find(z=>z.source_slot_id===wanted);
 assert.deepEqual(patch.source_exact_response_bbox_pdf_points_top_left,proof.original_exact_answer_glyph_bbox_pdf_points_top_left);
 assert.equal(patch.source_pdf_page_1based,proof.original_pdf_page_1based);
 assert.equal(patch.original_pdf_sha256,visual.original_pdf_sha256);
 assert.equal(patch.original_333_unchanged,true);
 assert.equal(patch.no_KP_authority_change,true);
 assert.equal(patch.not_eligible_for_operator_selective_PR,true);
});

test('effective source-work identity ledger applies precisely one disjoint status override with no double counting',()=>{
 assert.equal(original.known_atomic_source_dispositions.length,1762);
 const base=new Map(original.known_atomic_source_dispositions.map(r=>[r.source_slot_id,r.disposition]));
 assert.equal(base.size,1762);
 base.set(wanted,'HOLD');
 const counts={PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0};
 for(const status of base.values()){assert.ok(status in counts);counts[status]++;}
 assert.deepEqual(counts,patch.effect_source_work_disjoint);
 assert.deepEqual(counts,{PUBLISHED:333,HOLD:284,ALIAS:15,UNREVIEWED:1130});
 assert.equal(Object.values(counts).reduce((a,b)=>a+b),1762);
 const heshun=original.known_atomic_source_dispositions.filter(r=>r.paper_id==='SCI_G04_S1_113_FINAL_001');
 const hcounts={PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0};
 for(const row of heshun)hcounts[base.get(row.source_slot_id)]++;
 assert.deepEqual(hcounts,patch.heshun_final001_disjoint_effect);
 const originalScanIds=new Set([
 'SCI_G04_S1_113_MID_002','SCI_G04_S1_113_FINAL_001','SCI_G04_S1_113_FINAL_002',
 'SCI_G04_S1_113_MID_006','SCI_G04_S1_113_FINAL_009']);
 const scounts={PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0};
 for(const row of original.known_atomic_source_dispositions)if(originalScanIds.has(row.paper_id))scounts[base.get(row.source_slot_id)]++;
 assert.deepEqual(scounts,patch.scan5_disjoint_effect);
 assert.equal(patch.new_FORMAL_SCIENCE_KP_APPROVED,0);
 assert.equal(patch.new_ADMISSION_READY,0);
 assert.equal(patch.new_PUBLISHED,0);
});
