# Publishing @taiga-ui-labs/playwright to npm

This is an **experimental, independently maintained** Taiga UI v5 Playwright library. It is not an official Taiga UI package. A mapped 133/133 harness catalog does not mean exhaustive behavioral testing or a stable API.

## One-time setup: first public 0.1.0 publication

1. Confirm you own / administer the **npm** scope `@taiga-ui-labs`. Owning the GitHub organization does not grant npm permissions.
2. Merge the release preparation PR only after every CI job succeeds. The merged `main` must contain `version: "0.1.0"` and **must not** contain `private: true`.
3. Use Node.js 24, sign in to npm with an account authorized for the scope, with 2FA configured. From a clean checkout of `main`:

```sh
git clone https://github.com/splincode-taiga-labs/taiga-ui-playwright.git
cd taiga-ui-playwright
node --version
npm --version
npm login
npm whoami
npm ci --no-audit --no-fund
npm run typecheck
npm run build
npm run test:consumer
npm pack --dry-run
node -p 'const p = require("./package.json"); p.name + "@" + p.version + ", private=" + Boolean(p.private)'
npm publish --access public
npm view @taiga-ui-labs/playwright@0.1.0 version
```

The first publication is manual because npm Trusted Publishing requires an **existing package**. Confirm the tarball content and your scope permissions before running `npm publish`. Do not create `v0.1.0` before publishing; this workflow deliberately excludes that tag from automated publishing.

## Enable GitHub Actions Trusted Publishing

After `0.1.0` appears on npm:

1. Create a GitHub **Environment** named exactly `npm` in `Settings → Environments`. Configure required reviewers and restrict allowed deployment refs/tags as appropriate.
2. In npm, open the package `@taiga-ui-labs/playwright` → **Settings → Trusted Publisher → GitHub Actions** and enter:
   - Organization: `splincode-taiga-labs`
   - Repository: `taiga-ui-playwright`
   - Workflow filename: `publish.yml` (not the full path)
   - Environment: `npm`
3. Alternatively, on npm CLI 11.15.0+, configure trust with 2FA:

```sh
npm install --global npm@^11.15.0
npm trust github @taiga-ui-labs/playwright --repo splincode-taiga-labs/taiga-ui-playwright --file publish.yml --env npm --allow-publish
```

Trusted Publishing requires npm >= 11.5.1 and Node >= 22.14 in CI; the publish job uses Node 24 and npm 11.15+. No `NPM_TOKEN` or long-lived publish secret is needed.

## Future automatic releases

1. Update `package.json` and `package-lock.json` in a normal PR (e.g. `npm version 0.1.1 --no-git-tag-version`), merge only when CI is green.
2. Create and push a matching tag on the merged `main` commit:

```sh
git switch main
git pull --ff-only
git tag v0.1.1
git push origin v0.1.1
```

3. `.github/workflows/publish.yml` checks that the tag matches `package.json`, is reachable from `main`, and that full browser / consumer validation passed. It packs the verified build, uploads a tarball, and publishes **that tarball** with OIDC after environment protection. Stable versions receive npm tag `latest`; prereleases (e.g. `v0.2.0-next.0`) receive `next`.
4. Never republish the same npm name+version. The initial `v0.1.0` tag is excluded from this workflow because version `0.1.0` was published manually.

Publishing is NOT triggered by merging PRs. Verify `main` CI, release environments, and your npm package ownership. See [compatibility policy](api-upstream-compatibility.md) for limitations.

Official references: https://docs.npmjs.com/trusted-publishers/ and https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/.
