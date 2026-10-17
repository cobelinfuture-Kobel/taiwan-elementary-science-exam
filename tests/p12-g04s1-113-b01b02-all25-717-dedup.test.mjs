import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=x=>JSON.parse(fs.readFileSync('data/review/'+x,'utf8'));
const consolidated=read('p12-g04s1-113-b01b02-100-vs114-all25-717-source-duplicate-readback-v1.json');
const shards=['01','02','03'].map(n=>read('p12-g04s1-113-b01b02-100-vs114-original-dedup-shard'+n+'-v1.json'));
test('B01+B02 genuine 25/717 original 114 corpus comparison all source files nonduplicated',()=>{
 const c=consolidated.checks;
 assert.equal(c.original114_papers_count,25);
 assert.equal(c.original114_source_record_count,717);
 assert.equal(c.current113_source_positions,100);
 assert.equal(shards.reduce((n,x)=>n+x.original114_papers_compared.length,0),25);
 assert.equal(shards.reduce((n,x)=>n+x.original114_source_rows_compared,0),717);
 assert.equal(new Set(shards.flatMap(x=>x.original114_papers_compared)).size,25);
 assert.equal(crossMatches().length,consolidated.crossyear_matches.length);
});
function crossMatches(){return shards.flatMap(x=>x.matches)}
test('B01+B02 exact/near source duplicate candidates never auto-admit',()=>{
 assert.equal(consolidated.checks.within_B01B02_exact_answer_text_pairs,5);
 assert.equal(consolidated.checks.crossyear_113_114_exact_match_pairs,4);
 assert.equal(consolidated.checks.crossyear_113_114_near_matches,2);
 assert.equal(consolidated.checks.new_admission_ready,0);
 assert.equal(consolidated.checks.new_public_admissions,0);
 assert.equal(consolidated.full_semantic_duplicate_review_completed,false);
 assert.deepEqual(consolidated.crossyear_matches,crossMatches());
 assert.ok(consolidated.crossyear_matches.every(x=>x.archive114_id.startsWith('SCI_G04_S1_114_')));
 const ids=new Set(consolidated.crossyear_matches.filter(x=>x.comparison==='EXACT_STEM_AND_OPTIONS').map(x=>x.current113_id));
 assert.equal(ids.size,4);
 assert.ok(ids.has('SCI_G04_S1_113_MID_004|S2|TF|17'));
});
