import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const ledger=read("data/review/p12-g04s1-113-b08-source50-17published-33hold-complete-closeout-v1.json");
const parent7=read("site/data/question-bank/p12-g04s1-113-b08-chenggong-mc7-two-parent-public-v1.json");
const parent10=read("site/data/question-bank/p12-g04s1-113-b08-matching10-two-parent-public-v1.json");
test("B08 all 50 source positions are exactly 17 published or 33 still held",()=>{
 assert.deepEqual([ledger.original_source_positions,ledger.all_published_B08_ordinals.length,ledger.all_hold33_ordinals.length],[50,17,33]);
 assert.equal(new Set([...ledger.all_published_B08_ordinals,...ledger.all_hold33_ordinals]).size,50);
 assert.equal(ledger.nonunique_original_368_369_remain_HOLD,true);
 assert.equal(ledger.B01_through_B07_unchanged,true);
 assert.equal(ledger.source_review_pr_124_open_draft_unmerged,true);
});
test("B08 17 published slots in original 4 codebank/group contexts, actual Pages 969",()=>{
 assert.deepEqual([parent7.blocks.length,parent10.blocks.length],[2,2]);
 assert.deepEqual([parent7.blocks.reduce((n,g)=>n+g.items.length,0),parent10.blocks.reduce((n,g)=>n+g.items.length,0)],[7,10]);
 assert.deepEqual(ledger.formal_B08_cumulative,{FORMAL_SCIENCE_KP_APPROVED:17,ADMISSION_READY_remaining:0,PUBLISHED:17});
 assert.deepEqual(ledger.formal_matching10_new,{FORMAL_SCIENCE_KP_APPROVED:10,ADMISSION_READY_prior_to_publication:10,ADMISSION_READY_remaining:0,PUBLISHED:10});
 assert.equal(ledger.releases.matching10_live_Pages_result,"success");
 assert.equal(ledger.releases.matching10_live_Pages_run,40160870462);
 assert.deepEqual([ledger.site_after_publish.certified_answer_slots,ledger.site_after_publish.certified_context_groups],[969,40]);
 assert.ok(parent10.blocks.every(g=>g.original_cropped_assets_included===false));
});
