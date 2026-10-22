# LiftLab progress

## Current status

Milestones 1 and 2 are complete: workout logging is validated, profiles are local and separated, and profile backups work. Milestone 3's curated catalog and filters are implemented. The first exercise coaching detail view is implemented and the user approved its wording.

## Completed and verified

- The starter catalog contains 91 built-in strength exercises. Existing exercise IDs are preserved; catalog updates add new entries without replacing user exercise edits, plans, history, or active workout drafts.
- Exercise library filters support text, muscle, and equipment together. The user confirmed combined Chest + Machine filtering.
- The Add exercise picker supports the same combined filters. The user reported that the filters work after the missing change handlers were connected.
- Exercise Details show muscles, equipment, a starter rep range, setup, movement, and a watch-for cue. Details open from the exercise library, planned workout list, routine editor, and active workout. The user said the cue wording is good and confirmed the entry points work.
- Coaching cues cover all built-in exercises by movement family. Custom exercises receive a general fallback. Exercise text was informed by the English instructions in the MIT-licensed source dataset; LiftLab does not include the full dataset or media.
- `npm.cmd test` passed 21 tests. JavaScript syntax checks passed for `app.js`, `exercise-guides.js`, and `sw.js`. `git diff --check` passed before staging.
- User manually confirmed workout completion/history, recovery of an unfinished workout after reopening, empty-session validation, profile creation/switching, export/import, reload persistence, catalog visibility, library filtering, picker filtering, and Details access.

## Known issues and limits

- Browser UI and offline/install behavior are not automated. Android installation has not been verified as part of this implementation.
- Coaching cues are general movement-family guidance, not individually authored or reviewed by a coach or clinician. No GIFs or images are included.
- New custom exercises only receive a broad default muscle tag and no equipment tag; users cannot yet edit these tags through the custom exercise form.
- Existing progress charts show estimated 1RM, weekly volume, and records. Consistency and weekly sets by muscle group remain planned work.
- Evidence-based training suggestions and any AI service remain optional future research; no external service is selected.

## Decisions

- Near-term: personal, local-first phone use. The long-term goal remains a downloadable Android app.
- Keep data on-device and support separate local profiles; no accounts or cloud sync.
- Keep exercise media out until reuse rights are clear. Written guidance remains available offline.
- `PLAN.md` is the scope source of truth; this file records execution status. `LEARNING_GUIDE.md` explains the app concepts and decisions.
- The reviewed workout reliability, profile, planning, catalog, filter, and coaching-guidance changes are committed as one group because shared application files span those milestones.

## Next recommended action

After this commit, move to Milestone 5: add training consistency and weekly sets by muscle group, with hand-checkable calculation tests. Keep the implementation focused and manually review the progress screen on phone.

## Repository note

`LIFTLAB_HANDOFF.md` was untracked before this commit work and is intentionally left untouched.
