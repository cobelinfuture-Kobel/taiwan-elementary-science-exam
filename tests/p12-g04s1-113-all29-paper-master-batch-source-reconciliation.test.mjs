import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=p=>JSON.parse(readFileSync(new URL('../'+p, import.meta.url),'utf8'));
const root='data/review/';
const x=rd(root+'p12-g04s1-113-all29-paper-level-admission-master-v1.json');
const pubA=rd(root+'p12-g04s1-113-all29-published-source-shardA-v1.json');
const pubB=rd(root+'p12-g04s1-113-all29-published-source-shardB-v1.json');
const batchA=rd(root+'p12-g04s1-113-all29-batches-b01to06-source-disposition-v1.json');
const batchB=rd(root+'p12-g04s1-113-all29-batches-b07to09-source-disposition-v1.json');
const original=rd(root+'p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const auth=rd('site/data/authority/science-g03-g04-selector-v3.json');
test('29 real original source PDFs are exactly partitioned into 13 batched and 16 not in B worklists',()=>{
 assert.equal(x.per_original_paper.length,29);
 assert.equal(new Set(x.per_original_paper.map(z=>z.source_paper_id)).size,29);
 assert.deepEqual(new Set(x.per_original_paper.map(z=>z.source_paper_id)),new Set(original.original_source_records.map(z=>z.source_id)));
 const z=x.totals;
 assert.deepEqual([z.original_papers,z.midterm_papers,z.finalterm_papers,z.B_touched_distinct_papers,z.B_untouched_distinct_papers],[29,18,11,13,16]);
 assert.equal(z.B_untouched_but_historical_published_papers,11);
 assert.equal(z.papers_with_any_public_113_student_answers,24);
 assert.equal(z.papers_with_zero_published,5);
 assert.equal(x.per_original_paper.filter(q=>!q.B01_B09_touched).reduce((s,q)=>s+q.public_113_total,0),118);
 assert.equal(auth.units.filter(u=>u.grade===4&&u.semester===1).reduce((s,u)=>s+u.knowledge_points.length,0),48);
});
test('Source-linked public 113 student answers are exactly 333, 178 legacy + 155 from B batches',()=>{
 const ids=[...pubA.source_rows,...pubB.source_rows];
 assert.equal(pubA.source_rows.length,165);assert.equal(pubB.source_rows.length,168);
 assert.equal(ids.length,333);
 assert.equal(new Set(ids.map(q=>q.source_slot_id)).size,333);
 assert.equal(new Set(ids.map(q=>q.student_id)).size,333);
 const by=new Map(x.per_original_paper.map(q=>[q.source_paper_id,0]));
 for(const q of ids){assert.ok(by.has(q.paper_id));by.set(q.paper_id,by.get(q.paper_id)+1)}
 for(const q of x.per_original_paper)assert.equal(by.get(q.source_paper_id),q.public_113_total,q.source_paper_id);
 assert.equal(x.totals.whole113_current_PUBLIC_answer_slots,333);
 assert.equal(x.totals.public_pre_B01,178);
 assert.equal(x.totals.B01_B09_newly_PUBLISHED,155);
});
test('All 408 immutable B01–B09 work positions are classified without confusing HOLD and published',()=>{
 const rows=[...batchA.source_rows,...batchB.source_rows],counts={PUBLISHED:0,HOLD:0,ALIAS:0};
 assert.equal(batchA.source_rows.length,300);assert.equal(batchB.source_rows.length,108);
 assert.equal(rows.length,408);
 const by=new Map(x.per_original_paper.map(q=>[q.source_paper_id,{n:0,pub:0,hold:0,alias:0}]));
 for(const row of rows){const z=by.get(row.paper_id);assert.ok(z,row.paper_id);assert.ok(Object.hasOwn(counts,row.status));z.n++;counts[row.status]++;if(row.status==='PUBLISHED')z.pub++;if(row.status==='HOLD')z.hold++;if(row.status==='ALIAS')z.alias++}
 assert.deepEqual(counts,{PUBLISHED:155,HOLD:240,ALIAS:13});
 for(const q of x.per_original_paper){const z=by.get(q.source_paper_id);assert.equal(z.n,q.batch_positions);assert.equal(z.pub,q.B_newly_published);assert.equal(z.hold,q.B_HOLD);assert.equal(z.alias,q.B_alias_or_already_published);assert.equal(q.published_before_B01_position_count+q.B_newly_published,q.public_113_total);assert.equal(q.batch_positions,q.B_newly_published+q.B_HOLD+q.B_alias_or_already_published)}
 assert.equal(x.totals.B01_B09_source_positions_checked,408);
});
test('Source-only scan rectangles are not new admissions or invented complete paper denominators',()=>{
 assert.equal(x.totals.known_scan_raster_source_box_positions,216);
 assert.equal(x.totals.certified_all29_distinct_answer_position_denominator,null);
 assert.equal(x.totals.certified_all29_total_unreviewed_questions,null);
 assert.equal(x.totals.all29_papers_Admission_CLOSED,0);
 assert.ok(x.per_original_paper.every(q=>q.exact_full_original_paper_answer_position_total===null&&q.unreviewed_exact_position_count===null&&!q.per_paper_full_admission_closed));
 assert.deepEqual(x.formal_this_PR_new,{FORMAL_SCIENCE_KP_APPROVED:0,ADMISSION_READY:0,PUBLISHED:0});
 assert.equal(x.no_B01_to_B09_release_reopen,true);
});
test('Human readable CSV has exactly one row per original source paper and blank unknown denominators',()=>{
 const txt=readFileSync(new URL('../data/review/p12-g04s1-113-all29-paper-level-admission-master-v1.csv',import.meta.url),'utf8').replace(/^\uFEFF/,'').trimEnd();
 const rows=txt.split(/\r?\n/);
 assert.equal(rows.length,30);
 assert.equal(rows[0].split(',').length,18);
 assert.equal(new Set(rows.slice(1).map(z=>z.split(',')[0])).size,29);
});
