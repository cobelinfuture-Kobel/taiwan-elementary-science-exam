import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('data/review');
const load=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const source=load('p12-g04s1-113-native-tfmc-b01-50-pdf-text-model-kp-preflight-v1.json');
const science=load('p12-g04s1-113-b01-14-candidate-science-kp-duplicate-review-v1.json');
const published=load('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');

test('B01 all 14 science/KP records are grounded in recovered original source text',()=>{
  assert.equal(science.reviewed_prior_model_candidates,14);
  assert.equal(science.items.length,14);
  assert.equal(science.items.filter(x=>x.science_review_status==='TEXT_LAYER_SCIENCE_ANSWER_SUPPORTED').length,13);
  assert.equal(science.items.filter(x=>x.science_review_status==='HOLD_NONUNIQUE_SCIENCE').length,1);
  assert.equal(science.new_formally_approved_unique_science_kp,0);
  assert.equal(science.new_admission_ready,0);
  assert.equal(science.new_published,0);
  for(const i of science.items){
    const row=source.rows.find(x=>x.normalized_source_slot_id===i.source_slot_id);
    assert.ok(row && row.stem_pdf_text_layer.length>0, i.source_slot_id);
    assert.ok(/^sci_g04s1_02_\d{2}$/.test(i.direct_frozen_kp_candidate));
    assert.equal(i.formal_science_kp_approved,false);
    assert.equal(i.admission_ready,false);
    assert.equal(i.published,false);
  }
});

test('B01 science ambiguity is HOLD, not auto-promoted from prior option1 model suggestion',()=>{
  const i=science.items.find(x=>x.source_slot_id==='SCI_G04_S1_113_MID_004|S1|MC|2');
  assert.equal(i.independent_science_text_answer,null);
  assert.equal(i.duplicate_routing,'HOLD_SCIENCE_NONUNIQUE');
});

test('B01 published-source and exact duplicate suppression remains fail-closed',()=>{
  assert.equal(published.newly_published_113_slots,114);
  const w=science.items.find(x=>x.source_slot_id==='SCI_G04_S1_113_MID_001|S1|TF|14');
  assert.equal(w.duplicate_routing,'HOLD_PUBLISHED_SEMANTIC_DUP');
  const x=science.items.find(x=>x.source_slot_id==='SCI_G04_S1_113_MID_001|S2|MC|11');
  const y=science.items.find(x=>x.source_slot_id==='SCI_G04_S1_113_MID_003|S2|MC|4');
  assert.equal(x.duplicate_routing,'HOLD_WITHIN_BATCH_EXACT_DUP');
  assert.equal(y.duplicate_routing,'HOLD_WITHIN_BATCH_EXACT_DUP');
  assert.ok(source.within_B01_exact_source_text_duplicates.some(g=>g.includes(x.source_slot_id)&&g.includes(y.source_slot_id)));
});
