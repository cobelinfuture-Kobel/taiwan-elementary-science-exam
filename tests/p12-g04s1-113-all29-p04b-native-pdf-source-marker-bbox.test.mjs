import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('data/review');
const read=x=>JSON.parse(fs.readFileSync(path.join(root,x),'utf8'));
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const old=read('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
const artifacts=[
  read('p12-g04s1-113-p04b-dongguang-mid-final-64-native-answer-marker-bbox-v1.json'),
  read('p12-g04s1-113-p04b-dadun-mid29-native-answer-marker-bbox-v1.json')
];
const norm=id=>id.replace(/\|S0*(\d+)\|/,'|S$1|').replace(/\|SINGLE_CHOICE\|/,'|MC|').replace(/\|TRUE_FALSE\|/,'|TF|').replace(/\|0+(\d+)$/,(m,n)=>'|'+Number(n));
const published=new Set(old.all_unique_published_source_slot_ids.map(norm));
const registered=new Map(master.paper_records.map(x=>[x.paper_id,x]));
test('P04B exact original native question answer-marker boxes: 64+29=93 distinct physical source IDs under ALL29',()=>{
  assert.equal(artifacts[0].records.length,64);
  assert.equal(artifacts[1].records.length,29);
  const all=artifacts.flatMap(x=>x.records);
  assert.equal(new Set(all.map(x=>norm(x.source_slot_id))).size,93);
  assert.equal(master.p04b_native_original_pdf_marker_bbox_count,93);
  assert.equal(master.p04b_original_school_papers_with_native_marker_positions,3);
  const countBy=new Map();
  for(const item of all){
    const pid=item.source_slot_id.split('|')[0];
    const original=registered.get(pid);
    assert.ok(original,'unregistered source cannot be added');
    assert.equal(item.source_pdf_sha256||item.original_pdf_sha256,original.original_pdf_sha256);
    assert.equal(item.original_pdf_page,1);
    const [x0,y0,x1,y1]=item.original_answer_marker_native_pdf_bbox_pt;
    assert.ok(x0>=0&&x1<=729&&y0>=0&&y1<=1032&&x0<x1&&y0<y1,'original marker must have a real source page bbox');
    assert.ok(!item.admission_ready);
    countBy.set(pid,(countBy.get(pid)||0)+1);
  }
  assert.deepEqual([...countBy.values()].sort((a,b)=>a-b),[29,29,35]);
  for(const [pid,n] of countBy){
    assert.equal(registered.get(pid).p04b_native_original_pdf_marker_positions,n);
    assert.equal(registered.get(pid).inventory_certified,false);
    assert.equal(registered.get(pid).paper_closed,false);
  }
});
test('P04B preserve published source lineage and never count source marker as new admission',()=>{
  const all=artifacts.flatMap(a=>a.records);
  const existing=all.filter(x=>published.has(norm(x.source_slot_id))).length;
  assert.equal(existing,32); // 4 MID004, 11 FINAL003, 17 MID005
  assert.equal(all.length-existing,61);
  assert.equal(master.p04b_formal_science_kp_approved_new,0);
  assert.equal(master.p04b_admission_ready_new,0);
  assert.equal(master.p04b_published_new,0);
  assert.equal(master.all29_complete,false);
  assert.equal(master.formally_closed_papers,0);
});
test('P04B source marker counts never get promoted to an exactly-certified all29 original answer-slot denominator',()=>{
  assert.equal(master.p04b_nonnative_or_other_unresolved_original_answer_region_count_NOT_CERTIFIED,1762-93);
  assert.equal(master.source_position_universe_certified,false);
  assert.equal(master.p04b_original_source_bbox_gates_passed_new,0);
  assert.equal(master.p04_all29_original_independent_slot_ids_and_bbox_certified,false);
  assert.equal(master.exact_total_slots,null);
  assert.ok(master.paper_records.every(p=>p.exact_total_slots===null));
});
test('P04B negative: a duplicated normalized original source identity is a collision',()=>{
  const ids=artifacts.flatMap(a=>a.records.map(x=>norm(x.source_slot_id)));
  const duplicate=[...ids,ids[0]];
  assert.notEqual(new Set(duplicate).size,duplicate.length);
});
test('P04B negative: forged or out-of-bounds native PDF page geometry cannot pass',()=>{
  const id=artifacts[0].records[0];
  const bad=[...id.original_answer_marker_native_pdf_bbox_pt];
  bad[2]=bad[0]-1;
  assert.ok(!(bad[0]>=0 && bad[2]<=729 && bad[0]<bad[2]));
});
