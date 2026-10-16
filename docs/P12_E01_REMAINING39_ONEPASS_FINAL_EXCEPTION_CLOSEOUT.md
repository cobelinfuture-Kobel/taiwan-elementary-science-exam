# P12 E01 — 39 Remaining Exceptions / One-Pass Final Source Screening

**Base main:** `aab036edcf6637e17ee91e37decf41f4b25c3e8c` (PR #120 merged; actual Pages E6 pending/failing until repaired). Expected 636 student answer slots, 313 standalone TF, 188 standalone MC, 36 context groups, 39 source exceptions.

**Source of truth:** `data/review/p12-e01-postcloseout-remaining46-priority-review-v1.json` plus individually archived ScienceKP26, Scan9, and ScanSecondary6 reviews. All 39 original held positions were checked against 14 exact GitHub source archives with original full stems and SHA256 parity (39/39; 0 missing, 0 binary fingerprint conflicts, 0 text mismatch). No learner-facing stems, options, PDFs, canonical KPs, previous source reviews or history are rewritten.

**Final outcome: no further publishable candidate among 39.** This is not a failure of automation. Every position has an explicit current-authority disposition in `data/review/p12-e01-remaining39-onepass-final-exceptions-closeout-v1.json`:
- 5 excluded as already student-published identical question stems (in some instances other schools have different option order or answer label; do not duplicate/copy answer letter).
- 1 excluded due original printed duplicate ② choice label (cannot silently rewrite a formal exam).
- 1 excluded due original garbled source wording with inconsistent prior frozen transcription.
- 32 deferred under the currently approved Grade 4 Sem 1 190-KP authority due to source ambiguous/unconditional scientific propositions, absence of a direct canonical KP, or unresolved exact science answer. The authoritative original text may be reassessed if a source-grounded correction or formally approved new scope is ever available, **not by fabricating question wording, answers, or KP definitions**.

**Progress interpretation:** 39/39 positions are *triaged* and 0 untriaged. The 39 historical source records still exist: seven exclusions and 32 deferred. This **does not** mean 39 have been admitted to the student bank; nor should dashboard totals misleadingly claim 0 remaining historical source exceptions. Active publishable admission queue is empty at this source/authority boundary.

**Batch release:** no additional public bank JSON because zero eligible original questions, so already released PR #120 two Heshun original TF questions remain the sole current batch admission. Retain exact 636-slot school source bank without changing the 190-KP selector. Publish this one-pass closeout review through a single documentation/testing PR; E6 must verify the existing bank on **actual** Pages successfully before closeout.

**Current CI note:** PR #120 PR-level validation passed three workflows and was merged. Its first postmerge Pages test timed out waiting for public bank-info. Preserve fail-closed app behavior and diagnose/repair this E6 blocker, never lower expected page counts or mask loading errors.
