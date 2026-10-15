import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,readdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const script='scripts/review/p12-b04-auto-batch50.cjs';
const read=file=>JSON.parse(readFileSync(file,'utf8'));
test('P12 B04 AUTO_BATCH50 partitions 409 exact unique source IDs into 8 x 50 + 9',()=>{
 const out=mkdtempSync(join(tmpdir(),'b04-50-'));
 try{
  const logs=execFileSync(process.execPath,[script,'--out-dir='+out],{encoding:'utf8'});
  assert.match(logs,/P12_B04_AUTO_BATCH50_PREFLIGHT_PASS/);
  const mf=read(join(out,'manifest-v1.json'));
  assert.deepEqual(mf.counts.batch_sizes,[50,50,50,50,50,50,50,50,9]);
  assert.deepEqual(
   [mf.counts.original_source_occurrences,mf.counts.model_science_pass,mf.counts.original_priority_eligible,
    mf.counts.previously_reviewed,mf.counts.pending,mf.counts.batches],
   [717,644,425,16,409,9]);
  assert.equal(mf.counts.previously_accepted,15);
  assert.equal(mf.counts.previously_deduplicated,1);
  assert.equal(mf.counts.autopublished,0);
  const files=readdirSync(out).filter(x=>/^batch-\d\d-v1.json$/.test(x));
  assert.equal(files.length,9);
  const rows=files.flatMap(f=>read(join(out,f)).records);
  assert.equal(rows.length,409);
  assert.equal(new Set(rows.map(x=>x.source_id)).size,409);
  assert.equal(rows.some(x=>mf.previous_review_source_ids.includes(x.source_id)),false);
  assert.ok(rows.every(x=>x.release_allowed===false && x.exception_flags.includes('SCIENCE_UNIQUE_ANSWER_EVIDENCE_REQUIRED')));
  assert.ok(rows.every(x=>x.exception_flags.includes('CANONICAL_KP_SEMANTIC_APPROVAL_REQUIRED')));
  assert.ok(rows.every(x=>x.full_original_stem?.trim() && x.proposed_kp_id));
  const listed=mf.batch_descriptors.flatMap(b=>b.source_ids);
  assert.deepEqual(listed,rows.map(r=>r.source_id),'source id order stable across manifest and shards');
  assert.ok(mf.exclusions_do_not_block_other_batches);
 }finally{rmSync(out,{recursive:true,force:true});}
});
test('P12 B04 AUTO_BATCH50 supports isolated resumable batch selection and refuses invalid batch',()=>{
 const out=mkdtempSync(join(tmpdir(),'b04-one-'));
 try{
  execFileSync(process.execPath,[script,'--batch=9','--out-dir='+out],{encoding:'utf8'});
  assert.deepEqual(readdirSync(out).sort(),['batch-09-v1.json','manifest-v1.json']);
  assert.equal(read(join(out,'batch-09-v1.json')).records.length,9);
  assert.throws(()=>execFileSync(process.execPath,[script,'--batch=10'],{stdio:'pipe'}));
 }finally{rmSync(out,{recursive:true,force:true});}
});
