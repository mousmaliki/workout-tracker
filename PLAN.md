# LiftLab development roadmap

## Product direction

The near-term goal is to build and validate LiftLab for the user's personal local use on their phone. The long-term goal is an Android app that other people can download. The current personal-use delivery path is a Progressive Web App (PWA) hosted on GitHub Pages over HTTPS, which allows the phone browser to install it and cache it for offline launch. GitHub Pages is the current delivery mechanism, not the final distribution model.

For the current personal-use phase, LiftLab is local-first, with multiple profiles on one installation. Data remains on the device and is moved between devices through backup export/import. The current phase does not include accounts, cloud sync, or a server-side database. The eventual downloadable Android release may require packaging, publication, onboarding, support, privacy, or data-handling decisions; its distribution channel and technical format are not selected yet.

The user wants to learn app development while improving the product. Keep explanations beginner-friendly and record architecture and design decisions in `LEARNING_GUIDE.md`. Iterate on UI one focused change at a time with the user.

## Current baseline

The MVP already supports routines, exercise editing, active workout logging, history, estimated 1RM and weekly volume charts, JSON backup/import, and PWA install/offline behavior. The exercise library is small and currently filters by muscle group. The current automated suite has 17 core tests. See `PROGRESS.md` for validated status and known repository state.

## Milestone 1 — Stabilize workout logging

Tasks:

1. Inspect the existing uncommitted `app.js` change and validate the active script structure before making related edits.
2. Add automated cases for active-draft persistence and restoration, set editing/removal, session completion, and empty or invalid session handling.
3. Fix only issues exposed by those checks; confirm routine and exercise edits preserve saved session history.

Acceptance: an active workout survives reload; valid sets save to history; empty sessions cannot be saved; existing history survives routine and exercise edits.

Verification: run `npm test`; manually check starting, editing, reloading, finishing, and discarding a workout. Record the manual environment and result.

Learning record: explain the HTML, event handlers, core logic, and LocalStorage data path used by a workout.

## Milestone 2 — Add separate local profiles

Tasks:

1. Define and test a version 2 profile data envelope and a pure migration from version 1 data. The default profile has ID `profile-default`, name `Personal`, and owns its exercises, plans, sessions, and active draft.
2. Wire app loading/saving to the profile envelope, then add profile creation and switching with separate routines, exercise libraries, workout histories, and active drafts per profile. Include all-profile export/import in this same task so newly created profiles are not left out of the backup path; confirm before import replaces local data.

Version 2 envelope: `{ version: 2, activeProfileId: string, profiles: [{ id, name, exercises, plans, sessions, activeDraft }] }`. The migration in Task 1 returns this structure without mutating its version 1 input; applying it to LocalStorage is deferred until Task 2 is ready to use the profile format.

Acceptance: profiles stay isolated after switching and reload; migration preserves routines, exercises, sessions, and an active draft; all-profile backup round-trip preserves every profile, and legacy version 1 backups remain importable.

Verification: automated tests cover valid migration, preservation, non-mutation, invalid input, profile isolation, active drafts, and backup compatibility. Manually check existing-data migration, switching, reload, and import confirmation.

Learning record: explain the storage model, migration, and backup-format decisions. **Plan update:** all-profile backup support is included with profile UI/storage integration rather than deferred as a separate task; otherwise profiles could be created before the app had a way to back them up.

## Milestone 3 — Build the exercise catalog and filters

Tasks:

1. Give catalog exercises stable IDs, primary/secondary muscle arrays, normalized equipment tags, category, and rep ranges. Preserve existing IDs and make the profile catalog update append new entries and backfill tags without overwriting user edits or workout records.
2. Curate a useful starter set across bodyweight, barbell, dumbbell, machine, cable/pulley, kettlebell, and resistance bands. Prefer a compact subset of a reusable licensed source over copying a large dataset wholesale; record its source and license, and do not import media without separate rights.
3. Support text search and combined muscle/equipment filters in both the exercise library and the Add exercise picker; keep custom exercises editable and available. Show the number of matching/available exercises so active filters do not make the full catalog look smaller.

Acceptance: every built-in exercise has validated stable IDs, target-muscle tags, equipment tags, and usable rep ranges; existing plans, history, customized exercise names, and profiles survive catalog updates. Users can find catalog exercises by name, muscle, or equipment in both the library and Add exercise picker, combine filters, and add catalog or custom exercises to plans and workouts.

Verification: test catalog integrity, ID stability, profile catalog upgrades, and preservation of edited data. Then test filter matching; manually check catalog visibility, combined filters, empty results, and adding exercises to plans.

Learning record: explain the exercise data schema, source/license choices, how exercise IDs connect to plans and historical records, and how tags support future filters.

## Milestone 4 — Add exercise coaching details

Tasks:

1. Open exercise details from the library, then extend the same detail view to routine editor and active workout selections.
2. Show target muscles, equipment, concise setup and movement cues, common mistakes, and recent performance where available. Keep coaching copy exercise-specific and reviewed; initial pattern-based cues are a temporary baseline.
3. Add demonstrations only when suitable media and reuse rights are clear. Keep text guidance usable without media; load media on demand and provide accessible descriptions.

Acceptance: catalog entries have useful text guidance; details open from all three contexts; missing media does not break the view or offline text guidance.

Verification: test detail rendering and missing-media behavior; manually check mobile layout, keyboard access, and offline use.

Learning record: explain the detail UI, content structure, accessibility, and media-loading choices.

Plan update (2026-10-22): the user reported that the catalog seemed smaller and that muscle filters and exercise guidance were missing. These user-visible library pieces are being brought forward from Milestones 3–4 into the current catalog task. Current app copy uses conservative movement-pattern cues; exercise-specific review and details from plan/workout screens remain follow-up work.

Plan update (2026-10-22): the first detail screen now uses curated movement-family guidance for every built-in entry, with a fallback for custom exercises. The follow-up is manual review of the wording and adding detail access from workout/routine views; media remains deferred until rights are clear.

Plan update (2026-10-22): the user found that the Add exercise picker did not include the new muscle/equipment filters. Milestone 3 Task 3 now explicitly covers both the library page and picker so users can filter while building a routine or adding to an active workout.

## Milestone 5 — Improve progress insights

Tasks:

1. Keep estimated 1RM, weekly volume, and personal records; add training consistency and weekly sets by muscle group.
2. Make metric definitions clear and handle empty history and incomplete records without misleading totals.

Acceptance: displayed metrics match saved sessions, including multiple sessions per week and exercises tagged to multiple muscles.

Verification: add calculation tests using hand-checkable records; manually compare the charts and summaries to those records.

Learning record: explain how session data becomes metrics and charts, including estimate limitations.

## Milestone 6 — Collaboratively iterate on the interface

Tasks:

1. Review current screens at desktop and phone sizes and collect the user's observations and ideas.
2. Agree on and implement one focused UI change at a time; inspect it before selecting the next change.

Acceptance: every change has clear before/after behavior and works at relevant screen sizes without disrupting workout logging.

Verification: run relevant checks and manually inspect changed screens at desktop and phone widths.

Learning record: record the UI problem, decision, implementation area, and validation result for each completed change.

## Milestone 7 — Prepare the core app for continued use

Tasks:

1. Make the installed phone experience the acceptance target: verify home-screen installation, standalone launch, workout use, cache update, and offline launch on Android.
2. Verify desktop/local development as a supporting workflow; document GitHub Pages HTTPS deployment as the current delivery path to phone installation.
3. Document setup, profile behavior, backups, and validation steps; leave a precise next action in `PROGRESS.md`.

Acceptance: the app can be installed and launched directly from the Android home screen, core workout tasks are usable in that standalone experience, and it launches offline after caching. A fresh session can continue from project docs.

Verification: run `npm test`; manually check the installed Android experience, including offline launch and update behavior. Record if any phone/browser restriction requires reopening the app through the hosted URL.

Learning record: maintain the component map for HTML, CSS, JavaScript, data storage, tests, local serving, PWA, and deployment.

## Later release-readiness decision — Downloadable Android app

After the personal-use experience is stable, decide how other people will download LiftLab and what that release requires. Compare a packaged PWA with native or hybrid Android packaging, and decide the release channel, account/data expectations, support, privacy, and maintenance scope before committing to an implementation.

Acceptance to start release work: a separate, reviewed release proposal defines the audience, distribution channel, packaging approach, data/privacy model, and ongoing support expectations. This later goal does not expand the current personal-use scope automatically.

## Optional later exploration — Evidence-based training suggestions

This work is optional and does not block the core app.

1. Review suitable scientific publications and define what useful, appropriately limited suggestions should look like.
2. Compare transparent rules with an AI API only after the evidence review. Assess source attribution, accuracy evaluation, privacy, cost, and maintenance before choosing an approach.
3. Do not implement until a separate proposal defines evidence sources, user experience, evaluation, data sent to any service, and whether an API is justified.

Acceptance to enter implementation: the design and risks are documented and explicitly agreed. No AI provider, API, or recommendation behavior is selected in this roadmap.

Learning record: if explored, explain the evidence and architecture behind the chosen approach and its limitations.

## Dependencies and risks

- Stabilize logging before changing the storage model. Add profiles before expanding exercise metadata.
- Profile migration and all-profile backups are compatibility-sensitive and must have preservation tests.
- Exercise filters combine text search with muscle and equipment criteria. Exercise details use one shared view across library, plan editing, and active sessions.
- Media is optional and curated; no external content API or cloud service is assumed.
- Browser UI, Android install, and offline behavior require manual verification beyond current automated tests.
- Inspect the pre-existing `app.js` change before touching its wrapper/scope. Preserve unrelated user changes.
