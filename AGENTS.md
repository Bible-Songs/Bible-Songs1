# Bible Songs shared work

Before changing or publishing this app, read [Shared project workflow](docs/shared-project-workflow.md) and [Release handoff](docs/release-handoff.md). On Mike’s Mac, also read the parent project’s AGENTS.md.

- Start from GitHub’s current `origin/main` and report its commit and version. Inspect incoming changes and the working tree. Preserve existing sermons, downloads, Bible readings and account data.
- New app code, build tools and tests use strict TypeScript. Keep the compiler and policy checks enabled. Run `npm ci`, `npm run check`, `npm run build`, and relevant local browser checks for behavior changes.
- Publish only with Mike’s authorization or an existing instruction to publish when ready. Use a normal, fast-forward push with the pre-push archive hook. If main moved, integrate and test the incoming work and choose a fresh version before retrying.
- Update the release handoff as part of each authorized release. Record completed work, verification, and anything the next assistant should resume.

Mike authorizes routine local browser testing and read-only checks of the latest GitHub commit, app version, and deployment status without asking again. Skip routine live-site checks after publication unless requested.
