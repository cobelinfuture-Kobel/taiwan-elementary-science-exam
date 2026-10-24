import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const more=read('p12-g04s1-113-native46-two-original-visual-textcontamination-repairs-v1.json');
const prior=read('p12-g04s1-113-native38-originalpdf-visual-rights-formal-science-kp-v1.json');
const eight=read('p12-g04s1-113-native46-next11-science-kp-source-evidence-plus8-exceptions-v1.json');
const glyph=read('p12-g04s1-113-native5-originalpdf107-glyph-bbox-proof-v1.json');
test('two recovered original Dadun MC3 and MC14 are independently visible printable questions, not column/footer contamination',()=>{
 assert.equal(more.records.length,2);
 assert.equal(more.summary.previous_formal_38,38);
 assert.equal(more.summary.new_formal_science_direct_kp_verified,2);
 assert.equal(more.summary.cumulative_formal_science_kp_verified,40);
 assert.equal(more.summary.remaining_exception_count,6);
 const original=glyph.groups.find(x=>x.source_id==='SCI_G04_S1_113_MID_005'&&x.section==='S2'&&x.type==='MC');
 assert.ok(original);
 for(const x of more.records){
  assert.equal(x.source_slot_id.startsWith('SCI_G04_S1_113_MID_005|S2|MC|'),true);
  const index=Number(x.source_slot_id.split('|').at(-1))-1;
  const expected=original.encoded_geometry.split(';')[index].split('.').map(y=>parseInt(y,36)/100);
  assert.deepEqual(x.original_pdf_source_bbox,expected);
  assert.equal(x.original_pdf_printed_options_count,4);
  assert.ok(eight.remaining_exceptions.some(y=>y.source_slot_id===x.source_slot_id));
  assert.ok(!prior.records.some(y=>y.source_slot_id===x.source_slot_id));
  assert.equal(x.science_unique_answer_verified,true);
  assert.equal(x.direct_frozen48_canonical_kp_verified,true);
  assert.equal(x.rights_school_exam_text_component_verified,true);
  assert.equal(x.operator_final_release_batch_approval,false);
  assert.equal(x.admission_ready,false);
 }
 assert.equal(more.summary.admission_ready_new,0);
 assert.equal(more.summary.published_new,0);
});
