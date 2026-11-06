import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const rd=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const evidence=rd('data/review/p12-g04s1-113-all29-yongan-final005-five-lighttf-original-source-kp-dedup-v1.json');
const kp=rd('site/data/authority/science-g03-g04-selector-v3.json');
const archive=rd('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
const norm=s=>String(s||'').normalize('NFKC').replace(/[\s（）、，。！？：；「」『』().,!?;:—-]/g,'');
const dir=new URL('../site/data/question-bank/',import.meta.url);
const banks=readdirSync(dir).filter(f=>f.endsWith('.json')).flatMap(f=>{
 const doc=JSON.parse(readFileSync(new URL(f,dir),'utf8'));
 return (doc.blocks||[]).map(q=>({...q,__file:f}));
});
test('5 original Yongan OX children have exact inherited per-question PDF native boxes and shared instruction',()=>{
 assert.equal(evidence.total_original_source_work_positions,5);
 assert.equal(evidence.source_exact_5,true);
 assert.equal(evidence.native_bbox_5,true);
 assert.equal(evidence.parent_instruction_preserved,true);
 assert.equal(evidence.previous_published_333_unchanged,true);
 assert.equal(evidence.original_source_pdf_sha256,'94108a241a9833fda111ba7648ea4e1c424e5a64d84a090c42e4c9777c5218ec');
 const expected=[
 [56.64,656.62,98.78,671.15],
 [56.64,677.62,98.78,692.15],
 [56.64,698.62,98.78,713.15],
 [56.64,719.62,98.78,734.15],
 [56.64,761.62,98.78,776.15]
 ];
 const titles=new Map(kp.units.filter(x=>x.grade===4&&x.semester===1).flatMap(u=>u.knowledge_points.map(k=>[k.canonical_kp_id,k.title])));
 assert.equal(titles.size,48);
 assert.equal(evidence.rows.length,5);
 evidence.rows.forEach((r,i)=>{
  assert.equal(r.source_slot_id,'SCI_G04_S1_113_FINAL_005|S04|G01|LIGHT_TF|'+String(i+1).padStart(3,'0'));
  assert.equal(r.source_pdf_sha256,evidence.original_source_pdf_sha256);
  assert.equal(r.original_source_page_1_based,2);
  assert.deepEqual(r.original_answer_bracket_bbox_pdf_pts_top_left,expected[i]);
  assert.ok(r.original_stem_verbatim.endsWith('。'));
  assert.ok(r.original_parent_instruction.includes('不正確的請打╳'));
  assert.equal(r.original_options.length,0);
  assert.equal(r.science_unique_answer_model_supported,true);
  assert.equal(titles.get(r.model_proposed_direct_frozen48kp),r.model_proposed_direct_frozen48kp_title);
  assert.equal(r.original_status,'UNREVIEWED');
  assert.equal(r.operator_approved,false);
  assert.equal(r.FORMAL_SCIENCE_KP_APPROVED,false);
  assert.equal(r.ADMISSION_READY,false);
  assert.equal(r.PUBLISHED,false);
 });
});
test('no existing student public bank source or identical standalone true/false stem duplicates',()=>{
 assert.ok(banks.length>300);
 for(const r of evidence.rows){
  assert.equal(banks.some(x=>x.source_slot_id===r.source_slot_id),false);
  const m=banks.filter(x=>x.type==='tf'&&norm(x.stem)===norm(r.original_stem_verbatim));
  assert.equal(m.length,0,'Already published exact OX: '+r.source_slot_id+' => '+JSON.stringify(m.map(x=>({id:x.id,slot:x.source_slot_id,file:x.__file}))));
 }
});
test('114 frozen 25 original exam sources 717 positions have no exact light TF source',()=>{
 assert.equal(archive.current_public_source_paper_count,25);
 assert.equal(archive.cumulative_original_source_question_occurrences,717);
 const originals=archive.original_source_archive_evidence_refs.flatMap(p=>{
  const v=rd(p);
  return v.original_question_records||v.source_questions||v.questions||[];
 });
 assert.equal(originals.length,717);
 for(const r of evidence.rows){
  const exact=originals.filter(x=>norm(x.full_original_stem||x.stem)===norm(r.original_stem_verbatim));
  assert.equal(exact.length,0,'114 exact source alias: '+r.source_slot_id+' => '+JSON.stringify(exact.map(x=>x.source_id)));
 }
});
test('no false release from source-only Science/KP proposals and fail-closed operator',()=>{
 assert.equal(evidence.individual_operator_exact_source_approval,false);
 assert.equal(evidence.formal_science_kp_new,0);
 assert.equal(evidence.ADMISSION_READY_new,0);
 assert.equal(evidence.PUBLISHED_new,0);
 assert.equal(evidence.scan5_original_semantic_comparison_pending,true);
 assert.ok(evidence.rows.every(x=>x.operator_approved===false&&x.ADMISSION_READY===false&&x.PUBLISHED===false));
});