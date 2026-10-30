# Changelog

This project is experimental and independently maintained; the public API may change before 1.0.

## 0.1.2 — pending publication

- Prepare a patch release containing the runtime-only npm packlist fix from PR #85. Unlike the already-published 0.1.1 archive, the new tarball excludes generated Angular fixtures and documentation. The local tarball is guarded by `npm run test:pack`; the **published** package still needs verification after release.
- Include the independent registry Angular consumer checks from PR #87 and public export inventory/type-contract checks from PR #88, as well as the WebKit asynchronous ComboBox portal recovery covered by real browser regressions.
- Keep the API experimental: this patch release does not freeze the 266 named exports or approve 1.0.0. See [1.0 readiness issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86).

## 0.1.1 — 2026-10-27

- Released `@taiga-ui-labs/playwright@0.1.1` publicly on npm through GitHub Actions Trusted Publishing (OIDC), with signed provenance.
- Published the existing Locator-first helper library and its ESM declarations. Includes component-scoped Playwright helpers for Taiga UI v5, with real Angular/Playwright consumer verification and targeted browser smoke tests.
- Release workflow validates version tags, publishes the previously verified tarball, and protects publishing behind a GitHub Environment.

## 0.1.0 — initial experimental release

- Prepared the package for public installation, with typed ESM exports and standalone packed-consumer checks.
- Added documentation of tested Angular, Taiga UI, Playwright and Node.js combinations.

See [GitHub Actions](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/publish.yml) and the [compatibility notes](docs/api-upstream-compatibility.md) for additional details.
