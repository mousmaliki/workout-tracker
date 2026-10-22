# LiftLab working instructions

## Project approach

- Near-term, build and validate LiftLab for the user's personal local use on their phone. The long-term goal is an Android app that other people can download.
- Prioritize phone use and verify the installed experience on Android. GitHub Pages currently provides the HTTPS-hosted PWA for personal installation. Keep the eventual packaging and distribution channel (for example, an app store or direct download) as a future decision.
- Read `PLAN.md` for intended scope and `PROGRESS.md` for verified execution status before starting a task.
- Work on one small, well-defined task at a time. Keep changes focused and avoid unrelated refactoring.
- Before editing, inspect `git status` and the relevant code. Preserve pre-existing user changes; do not overwrite, reset, commit, or push them.
- Workout history and in-progress sessions are user data. Do not clear, migrate, or alter stored data without a task that explicitly covers it and tests for preservation.
- Explain relevant app concepts in plain language as work proceeds. Update `LEARNING_GUIDE.md` with the component(s) touched, the reason for important decisions, and what validation showed.
- UI work is collaborative: review the current screen, agree on a focused change with the user, implement it, and inspect it at the relevant screen sizes before choosing another change.
- Treat evidence-based training suggestions as optional research. Do not add an AI service or send user data to an external service without a separately agreed design.

## Verification and status

- Run the relevant checks before marking an implementation task complete. Record failures and unverified behavior honestly in `PROGRESS.md`.
- Update `PLAN.md` only when new information changes intended scope; explain the reason there and record the decision in `LEARNING_GUIDE.md`.
- At the end of a work session, update `PROGRESS.md` with changes, checks, remaining issues, and one precise next action.
- `PLAN.md` is the scope source of truth. `PROGRESS.md` is the execution-status source of truth. `LEARNING_GUIDE.md` is the plain-language architecture and decision record.
- The user handles Git commits and pushes unless they explicitly ask otherwise.
