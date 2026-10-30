# Publishing @taiga-ui-labs/playwright to npm

This is an unofficial, independently maintained Taiga UI v5 Playwright library. The npm package remains **pre-1.0 until the final tag is published**. The public API and compatibility policy are tracked in [issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86).

## Current published release

- `0.1.2` was published on 2026-10-30 through [GitHub Actions Trusted Publishing (OIDC)](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/41048920224) with a signed provenance statement. It was published to npm with the `latest` dist-tag.
- The verified release tarball contains **123 files / 47,760 packed bytes** (47.8 kB), excluding Angular fixtures and documentation bundles. The immutable `0.1.1` archive contained 9,188 files; PR #85 corrected the source packlist, and `0.1.2` shipped that correction.
- CI now installs the actual published `0.1.2` from the npm registry in an isolated Angular/Taiga UI consumer. This is separate from the release's pre-publication checks of the local tarball.
- The release workflow is [`.github/workflows/publish.yml`](../.github/workflows/publish.yml). It requires a matching tag on `main`, all verification jobs, and the protected GitHub `npm` environment.

## Patch release checklist

1. Merge the version/change-log PR only after all CI jobs pass. Confirm `package.json` and `package-lock.json` both specify the new version.
2. Verify the merged commit's full [CI workflow](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/ci.yml) is green, including the packlist guard, full Angular integration, browser smoke, and packed consumers.
3. From a clean local checkout of the **merged** `main`, create the tag matching the **next** package version. Never reuse an already-published tag:

```sh
git switch main
git pull --ff-only
VERSION="$(node -p 'require("./package.json").version')"
git tag "v$VERSION"
git push origin "v$VERSION"
```

4. Review the [publish workflow](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/publish.yml). The workflow verifies the tag belongs to `main`, builds and checks the exact tarball, tests the browser/consumer matrix, and publishes that verified tarball through npm OIDC **after environment approval**. Stable versions use npm dist-tag `latest`; prereleases use `next`.
5. Confirm that the npm registry contains the **new exact version**, the tarball contains only expected runtime/declaration files, and npm provenance is available. Run the CI workflow manually with `npm_version=<published-version>` to install and test the *published* artifact in an independent real Angular/Taiga UI consumer. Update both the workflow-dispatch default and `CONSUMER_REGISTRY_VERSION` fallback after validating the new release; PR CI should also pass against that published version.
6. Record the publish and consumer run links in [issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86). Publishing `0.1.2` alone does not close the 1.0 readiness issue.

**Never** republish an existing npm package version, set long-lived npm tokens, run an unverified manual `npm publish`, or push a version tag before the release PR is merged and the `main` CI is green. The `v0.1.0` bootstrap exception is historical and is intentionally excluded from tag publishing.

## Preparing a 1.0 release candidate

First agree on and document the supported public API (not just names), Taiga/Angular/Node/Playwright compatibility promise, and error/overlay behavior. See [public API draft](public-api.md) and [tested compatibility](api-upstream-compatibility.md). All 133 catalog mappings are **not** a claim of exhaustive behavior coverage.

The `release/1.0.0-rc.1` proposal keeps the 266 root exports and adds packed-export/type-contract checks. **Do not tag an unreviewed RC branch.** When pre-RC requirements are satisfied and its PR is green:

1. Review and merge the `1.0.0-rc.1` version bump, API contract, compatibility notes and changelog; do not publish final `1.0.0` yet.
2. Merge it only with green CI, then tag the reviewed `main` commit as `v1.0.0-rc.1`.
3. The protected OIDC workflow publishes the candidate under npm dist-tag `next`, leaving `latest` unaffected.
4. Trigger the CI workflow manually with `npm_version=1.0.0-rc.1`. Verify registry install, tarball footprint, TypeScript contracts and real Angular browser behavior; resolve regressions.
5. Request an explicit maintainer GO in #86 before any final `v1.0.0` tag.

The release workflow uses Node 24 with a supported npm 11 version and requests short-lived OIDC credentials; the package's consumer runtime support is a separate compatibility question. See [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) for details.
