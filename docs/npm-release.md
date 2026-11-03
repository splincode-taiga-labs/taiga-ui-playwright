# Publish a release to npm

Releases are manual; npm publishing is automatic. There is no Release Please,
generated changelog, release PR, or committed version bump.

1. Merge your changes to `main` after CI passes.
2. Open [GitHub Releases](https://github.com/splincode-taiga-labs/taiga-ui-playwright/releases/new).
3. Choose a **new tag** (for example `v1.0.1`) targeting `main`, then click **Publish release**.
4. The [Publish to npm workflow](../.github/workflows/publish.yml) runs on `release.published`,
   checks out that tag, verifies its commit is part of `main`, and runs `npm ci`,
   typecheck, build and packlist checks before publishing.
5. GitHub Actions uses the tag as the npm package version, for example
   `v1.0.1` becomes `@taiga-ui-labs/playwright@1.0.1`. It changes
   `package.json` and `package-lock.json` **only inside the runner**;
   no commits or new Git tags are created.

Publishing uses the existing GitHub `npm` environment and npm OIDC Trusted Publisher
bound to `.github/workflows/publish.yml`; no `NPM_TOKEN` is needed.
Stable releases use npm dist-tag `latest`; prereleases such as `v1.0.2-rc.1` use `next`.

Do not reuse an already published version. npm packages are immutable.
Publishing a Git tag alone does **not** trigger this workflow; you must publish
a GitHub Release associated with that tag.
