import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const script=fileURLToPath(new URL('../scripts/review/p12-g04s1-113-fixed29-admission-routing.cjs',import.meta.url));
test('B01 remains executable and future fixed-29 manifest can still be previewed without starting B02',()=>{
 const a=spawnSync(process.execPath,[script,'--batch=1'],{encoding:'utf8'});
 assert.equal(a.status,0,a.stderr);
 const batch=JSON.parse(a.stdout);
 assert.deepEqual(batch.generated_batches.map(x=>x.batch),['B01']);
 assert.equal(batch.generated_batches[0].start,1);
 assert.equal(batch.generated_batches[0].end,50);
 assert.equal(batch.ADMMISSION_READY_new,undefined);
 assert.equal(batch.ADMISSION_READY_new,0);
 const preview=spawnSync(process.execPath,[script],{encoding:'utf8'});
 assert.equal(preview.status,0,preview.stderr);
 const all=JSON.parse(preview.stdout);
 assert.equal(all.generated_batches.length,36);
 assert.equal(all.ALL29_FULL_FORMAL_COMPLETE,false);
});
test('B02 cannot execute with only model B01 source50; must have exact previous formal Admission and main/Pages closeout receipt',()=>{
 for(const n of [2,3,36]){
  const out=spawnSync(process.execPath,[script,'--batch='+n],{encoding:'utf8'});
  assert.notEqual(out.status,0);
  assert.match(out.stderr,/B01_NOT_FORMALLY_CLOSED/);
  assert.match(out.stderr,/do not start B/);
 }
});
