import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
test('B07 live Pages Chromium E2E has valid Node ESM syntax and two separately named exact4 local objects',()=>{
 const path=fileURLToPath(new URL('../tools/verify-deployed-exam.mjs',import.meta.url));
 assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',path],{encoding:'utf8'}));
 const c=readFileSync(path,'utf8');
 assert.equal((c.match(/const exact4=/g)||[]).length,1);
 assert.equal((c.match(/const b07NewExact4=/g)||[]).length,1);
 assert.ok(c.includes('b07NewExact4.blocks.map(x=>x.source_original_slot_id)'));
 assert.ok(c.includes('已載入內建考古題 969 小題'));
});
