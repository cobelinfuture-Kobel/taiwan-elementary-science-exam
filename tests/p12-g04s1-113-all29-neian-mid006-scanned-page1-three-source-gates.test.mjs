import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const rd=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const q=rd('data/review/p12-g04s1-113-all29-neian-mid006-page1-three-scanned-exact-source-science-kp-gate-v1.json');
const kp=rd('site/data/authority/science-g03-g04-selector-v3.json');
const idx=rd('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
const norm=s=>String(s||'').normalize('NFKC').replace(/[\s（）、，。！？：；「」『』().,!?;:—-]/g,'');
const dir=new URL('../site/data/question-bank/',import.meta.url);
const banks=readdirSync(dir).filter(f=>f.endsWith('.json')).flatMap(f=>{
 const b=JSON.parse(readFileSync(new URL(f,dir),'utf8'));
 return (b.blocks||[]).map(x=>({...x,__file:f}));
});
const ros=q.rows;
test('three original raster positions and exact source full options; no cloned source bboxes',()=>{
 assert.equal(ros.length,3);
 assert.equal(new Set(ros.map(x=>x.source_slot_id)).size,3);
 assert.equal(q.original_pdf_sha256_direct_binary_reverified,'aec7ae8371c888e84da39653183050377c7dedf94dac71b112200cd9e78ba222');
 const boxes={
  'SCI_G04_S1_113_MID_006|S1|TF|006':[65.52,383.76,100.8,396.72],
  'SCI_G04_S1_113_MID_006|S2|MC|002':[64.44,720,99.72,732.96],
  'SCI_G04_S1_113_MID_006|S2|MC|009':[398.88,482.4,434.16,495.36]
 };
 const titles=new Map(kp.units.filter(x=>x.grade===4&&x.semester===1).flatMap(u=>u.knowledge_points.map(k=>[k.canonical_kp_id,k.title])));
 assert.equal(titles.size,48);
 for(const r of ros){
  assert.deepEqual(r.original_source_response_bbox_pdf_pts_top_left,boxes[r.source_slot_id]);
  assert.equal(r.original_pdf_sha256,q.original_pdf_sha256_direct_binary_reverified);
  assert.equal(r.original_pdf_page_1_based,1);
  assert.equal(r.original_page_embedded_scan_xref,8);
  assert.equal(r.source_slot_canonical_disposition_before,'UNREVIEWED');
  assert.equal(r.original_source_visual_readback,true);
  assert.equal(titles.get(r.direct_113_frozen48kp_id),r.direct_frozen_title);
  assert.equal(r.original_four_ordered_options.length,r.original_question_type==='MC'?4:0);
  assert.equal(r.operator_exact_source_roster_approved,false);
  assert.equal(r.formal_semantic_11329_11425_accepted,false);
  assert.equal(r.ADMISSION_READY,false);
  assert.equal(r.PUBLISHED,false);
 }
 assert.equal(q.one_science_direct_kp_positive_candidate_count,1);
 assert.equal(q.one_science_unique_but_direct_kp_open_count,1);
 assert.equal(q.one_science_context_hold_count,1);
});
test('full current main public bank: no exact standalone duplicate for three NEIAN source questions',()=>{
 assert.ok(banks.length>=300);
 for(const r of ros){
  assert.ok(!banks.some(b=>b.source_slot_id===r.source_slot_id));
  const dup=banks.filter(b=>{
   if(norm(b.stem)!==norm(r.original_stem_verbatim))return false;
   if(r.original_question_type==='TF')return b.type==='tf';
   if(b.type!=='mcq')return false;
   const opts=(b.options||[]).map(x=>norm(typeof x==='string'?x:x.text)).sort();
   const sourceOpts=r.original_four_ordered_options.map(norm).sort();
   return opts.length===4&&opts.every((x,i)=>x===sourceOpts[i]);
  });
  assert.equal(dup.length,0,'public exact duplicate: '+r.source_slot_id+' '+JSON.stringify(dup.map(b=>b.id)));
 }
});
test('all 25 original 114 source archive files and 717 rows: no fully identical source item for new candidates',()=>{
 assert.equal(idx.current_public_source_paper_count,25);
 assert.equal(idx.cumulative_original_source_question_occurrences,717);
 const all=idx.original_source_archive_evidence_refs.flatMap(file=>{
  const a=rd(file);
  return a.original_question_records||a.source_questions||a.questions||[];
 });
 assert.equal(all.length,717);
 for(const r of ros){
  const exact=all.filter(b=>norm(b.full_original_stem||b.stem)===norm(r.original_stem_verbatim)).filter(b=>{
    if(r.original_question_type==='TF')return true;
    const opts=b.original_ordered_options||b.options||b.answer_options||[];
    if(!Array.isArray(opts)||opts.length!==4)return false;
    const a=opts.map(x=>norm(typeof x==='string'?x:(x.text||x.option_text))).sort();
    const v=r.original_four_ordered_options.map(norm).sort();
    return a.every((z,i)=>z===v[i]);
  });
  assert.equal(exact.length,0,'114 original alias: '+r.source_slot_id+' '+JSON.stringify(exact.map(x=>x.source_id)));
 }
});
test('science model and direct-KP uncertainty remain blocked without operator exact roster',()=>{
 const r=Object.fromEntries(ros.map(x=>[x.source_slot_id,x]));
 assert.equal(r['SCI_G04_S1_113_MID_006|S2|MC|002'].independent_science_answer_NOT_TEACHER_KEY,'③');
 assert.equal(r['SCI_G04_S1_113_MID_006|S2|MC|002'].direct_kp_independently_verified,true);
 assert.equal(r['SCI_G04_S1_113_MID_006|S2|MC|009'].direct_kp_independently_verified,false);
 assert.equal(r['SCI_G04_S1_113_MID_006|S1|TF|006'].science_unique_answer_independently_verified,false);
 assert.equal(q.new_official_approved_science_kp,0);
 assert.equal(q.new_ADMISSION_READY,0);
 assert.equal(q.new_PUBLISHED,0);
 assert.equal(q.previous_published_333_untouched,true);
 assert.equal(q.original_113_frozen48KP_unchanged,true);
});