# ESP8266 Security Lab — Engineering Workflow & Conventions

This document establishes the official software development lifecycle, engineering standards, repository governance, and continuous integration/continuous deployment (CI/CD) pipelines for the **ESP8266 Security Lab** monorepo.

---

## 1. Repository Architecture & Monorepo Structure

The project is structured as a high-performance monorepo managed with **Turborepo** and **pnpm workspaces**:

```text
esp8266-security-lab/
├── .github/
│   └── workflows/
│       ├── ci.yml            # Linting, type-checking, testing, building & commit lint
│       ├── release.yml       # Automated versioning and tagging via Semantic Release
│       └── deploy.yml        # Continuous deployment pipeline to Netlify
├── .husky/                   # Git hook definitions (commit-msg, pre-commit)
├── apps/
│   ├── api/                  # Node.js + Express + TypeScript modular REST backend
│   └── web/                  # React + Vite + Tailwind CSS + shadcn/ui frontend
├── docs/                     # Architectural, database, workflow, and API documentation
├── module_1/                 # Educational course module: Attack Surface
├── module_2/                 # Educational course module: Wi-Fi Deauthentication (Defense)
├── commitlint.config.js      # Conventional Commits schema and scope validation
├── pnpm-workspace.yaml       # Monorepo workspace package boundaries
├── release.config.js         # Semantic Release branch and changelog configuration
└── turbo.json                # Turborepo task pipelines, caching, and dependency graph
```

---

## 2. Branching Strategy

The repository strictly enforces a feature-based branching model to ensure production stability:

- **`master` / `main`**: Production branch. Protected against direct commits. Releases and production deployments trigger exclusively from merges into this branch.
- **`develop`**: Integration branch for pre-release validation (when active).
- **`feat/<feature-name>`**: Development of new platform capabilities (e.g., `feat/web`, `feat/auth`, `feat/ai-grading`).
- **`fix/<issue-name>`**: Bug fixes and patches.
- **`refactor/<component>`**: Non-functional code improvements or architectural changes.
- **`docs/<topic>`**: Documentation updates and course curriculum expansions.
- **`chore/<task>`**: Dependency updates, tooling upgrades, and repository maintenance.

> [!IMPORTANT]
> All changes must be integrated into `master` via pull requests (PRs) that satisfy CI quality gates and Conventional Commit standards.

---

## 3. Commit Message Conventions (Conventional Commits)

Every commit must adhere to the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification. This convention directly powers automated changelog generation and semantic version bumps.

### Format
```text
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Commit Types
| Type | Purpose | Semantic Version Impact |
| :--- | :--- | :---: |
| `feat` | A new user-facing feature or educational capability | **Minor (0.X.0)** |
| `fix` | A bug fix or runtime patch | **Patch (0.0.X)** |
| `perf` | A performance enhancement | **Patch (0.0.X)** |
| `refactor` | Code restructuring without feature addition or bug fix | **Patch (0.0.X)** |
| `docs` | Documentation, course material, or README updates | None / Patch |
| `test` | Adding or correcting automated tests | None |
| `chore` | Maintenance, dependencies, tooling, or configuration | None |
| `ci` | Modifications to GitHub Actions workflows or scripts | None |
| `build` | Changes to build tooling or external dependencies | None |
| `revert` | Reverting a previous commit | Inherited |

### Allowed Scopes
- **Monorepo / Workspace**: `root`, `repo`, `deps`
- **Applications**: `web`, `api`, `auth`, `ui`, `assessment`, `admin`
- **Course & Curriculum**: `course`, `module_1`, `module_2`, `module_3`, `module_4`, `module_5`, `module_6`, `module_7`, `module_8`, `lesson_1`, `lesson_2`, `lesson_3`
- **Historical Scopes**: `attack-surface`, `vulnerability-detection`

### Breaking Changes
Any commit introducing breaking functional or architectural changes must append an exclamation mark (`!`) after the type/scope or include a `BREAKING CHANGE:` footer:
```text
feat(api)!: migrate assessment submission payload to v2 schema

BREAKING CHANGE: The assessment submission endpoint now requires rubricVersion in the request body.
```
*Breaking changes trigger an automatic **Major (X.0.0)** version increment.*

---

## 4. Git Hooks (Husky) & Commitlint

To prevent malformed commits from entering the Git history, the repository integrates **Husky v9** and **@commitlint/cli**:

- **`commit-msg`**: Triggered automatically during `git commit`. Verifies the commit message structure against `commitlint.config.js`. Invalid commit messages are rejected immediately before the commit is created.
- **`pre-commit`**: Executes fast local linting and type-checking on staged files before allowing commits.

### Testing Hooks Locally
```bash
# Valid commit test
git commit -m "docs(workflow): document engineering preflight standards"

# Invalid commit test (will be rejected by Commitlint)
git commit -m "updated stuff"
```

---

## 5. Monorepo Pipeline (Turborepo)

Turborepo orchestrates build, lint, test, and development tasks with dependency resolution and local/remote caching:

| Command | Action | Pipeline Target |
| :--- | :--- | :--- |
| `pnpm run dev` | Starts local development servers for all workspaces | `turbo run dev` |
| `pnpm run build` | Builds all packages in topological dependency order | `turbo run build` |
| `pnpm run lint` | Runs ESLint across all workspaces | `turbo run lint` |
| `pnpm run type-check` | Executes TypeScript compiler verification (`tsc --noEmit`) | `turbo run type-check` |
| `pnpm run test` | Executes unit and integration test suites | `turbo run test` |

---

## 6. Automated Semantic Release

Releases are fully automated via **Semantic Release** on pushes to the production branch (`master`):

1. **Commit Analysis**: Evaluates commit types since the last Git tag using `conventional-changelog`.
2. **Release Determination**: Automatically computes the next semantic version (`Major`, `Minor`, or `Patch`).
3. **Changelog Generation**: Updates `docs/CHANGELOG.md` with structured release notes.
4. **Git Tagging**: Tags the repository with the new release version (e.g., `v1.1.0`).
5. **GitHub Release**: Publishes a formal GitHub release containing linked commit notes and artifacts.

### Running a Release Dry-Run
To inspect what version bump a set of commits would produce without creating tags or publishing to GitHub:
```bash
pnpm run release:dry
```

---

## 7. Continuous Integration & Deployment (CI/CD)

### Continuous Integration (`ci.yml`)
Runs on every push to development branches (`feat/**`, `fix/**`) and on all Pull Requests:
1. **Commit Message Validation**: PR commits are verified via Commitlint.
2. **Dependency Integrity**: Enforces clean installations via `pnpm install --frozen-lockfile`.
3. **Code Quality**: Executes `turbo run lint`.
4. **Type Safety**: Executes `turbo run type-check`.
5. **Automated Testing**: Executes `turbo run test`.
6. **Artifact Compilation**: Executes `turbo run build`.

### Continuous Deployment (`deploy.yml`)
Executes exclusively when commits merge into `master`:
1. Compiles production assets (`apps/web/dist`).
2. Deploys static frontend assets to Netlify.
3. Notifies GitHub deployment status.
