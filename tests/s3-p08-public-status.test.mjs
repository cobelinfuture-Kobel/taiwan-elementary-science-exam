import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const status=JSON.parse(readFileSync("site/data/question-bank/s3-p08-status.json","utf8"));
const ctx=JSON.parse(readFileSync("site/data/question-bank/certified-context-groups-v1.json","utf8"));
const bank=JSON.parse(readFileSync("site/data/question-bank/approved-historical-ox-v3.json","utf8"));
test("public aggregate status is consistent with source-reviewed and admitted inventories",()=>{
 assert.equal(status.context_groups.length,20);assert.equal(status.certified_context_groups,9);assert.equal(status.deferred_context_groups,11);
 assert.equal(status.context_groups.filter(x=>x.publish_on_site).length,9);
 assert.deepEqual(new Set(ctx.groups.map(x=>x.id)),new Set(status.context_groups.filter(x=>x.publish_on_site).map(x=>x.group_id)));
 assert.equal(status.tf_cumulative,bank.blocks.length);
 assert.equal(status.total_embedded_answer_slots,bank.blocks.length+ctx.groups.reduce((n,x)=>n+x.items.length,0));
 assert.equal(status.original_figure_crops_publicly_reused,0);
});
