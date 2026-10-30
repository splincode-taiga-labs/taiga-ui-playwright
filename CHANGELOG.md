# Changelog

This is an independently maintained Taiga UI v5 Playwright library. Before final `1.0.0`, the public API is a release candidate and may still change.

## 1.0.0-rc.1 — release candidate (not published)

- Propose the first **1.0 public API contract**: retain all 266 named package-root exports from `0.1.2` without removals, document core Locator-first behavior, portal ownership, errors, and a narrow tested compatibility baseline.
- Verify all runtime exports from the packed ESM entrypoint in a clean consumer, in addition to the source-level export inventory and expanded NodeNext TypeScript method contracts.
- Keep the runtime and supported selectors unchanged from `0.1.2`. This release candidate is **not** a claim that all 133 mapped component harnesses have exhaustive browser coverage.
- After review and green CI, publish `v1.0.0-rc.1` via protected npm OIDC to dist-tag `next`; test the **published** version in an independent Angular/Taiga UI consumer before deciding on final `1.0.0`.

## 0.1.2 — 2026-10-30

- Published a runtime-only npm archive through [GitHub Actions OIDC](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/41048920224) with signed provenance: **123 files, 47,760 packed bytes**, excluding generated Angular fixture/docs output. The immutable `0.1.1` npm archive contained 9,188 files.
- Included independent Angular registry-consumer checks, public export inventory/type-contract checks, and WebKit asynchronous ComboBox portal recovery browser regressions.
- Verified `0.1.2` from the public npm registry in an isolated Angular 20 / Taiga UI 5.28 browser consumer through [PR #90 CI](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/41050281269).

## 0.1.1 — 2026-10-27

- Released `@taiga-ui-labs/playwright@0.1.1` publicly on npm through GitHub Actions Trusted Publishing (OIDC), with signed provenance.
- Published the Locator-first helper library and its ESM declarations, with real Angular/Playwright consumer verification and targeted browser smoke tests.
- Protected publishing behind a GitHub Environment.

## 0.1.0 — initial experimental release

- Prepared the package for public installation, with typed ESM exports and standalone packed-consumer checks.
- Added documentation of tested Angular, Taiga UI, Playwright and Node.js combinations.

See [GitHub Actions](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/publish.yml), the [1.0 API contract](docs/public-api.md), and [issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86) for release gates.
