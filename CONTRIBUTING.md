# Contributing to Wabi

## Branch Model

```
main        ← production only, protected
  ↑ PR only
staging     ← pre-production integration, protected
  ↑ PR only
feature/<name>   ← development, cut from staging
fix/<name>       ← bug fixes, cut from staging
hotfix/<name>    ← emergencies only, cut from main
```

No direct pushes to `main` or `staging`. All changes go through pull requests.

---

## Standard Feature Flow

```bash
# 1. Start from staging
git fetch origin
git checkout -b feature/my-feature origin/staging

# 2. Develop, commit locally
git commit -m "feat: describe what this does"

# 3. Run the full check suite before pushing
npm run ci

# 4. Push and open a PR targeting staging
git push -u origin feature/my-feature
# → Open PR: feature/my-feature → staging
# → CI must pass (typecheck + lint + build)
# → Merge when green

# 5. When staging is validated, open a PR: staging → main
# → CI must pass + reviewer approval required
# → Merge to ship to production
```

---

## Hotfix Flow (Production Emergency)

```bash
# 1. Cut directly from main
git fetch origin
git checkout -b hotfix/critical-fix origin/main

# 2. Fix, commit, run ci
npm run ci
git push -u origin hotfix/critical-fix

# 3. PR: hotfix/critical-fix → main (CI + approval)
# 4. After merge, immediately backport to staging:
git checkout staging
git pull origin staging
git merge --no-ff origin/main
git push origin staging
# Or open a PR: main → staging to track it
```

---

## Code Rollback

If a bad commit reaches `main`:

```bash
# Find the commit to undo
git log --oneline origin/main

# Revert it (creates a new commit — never force-push main)
git checkout main
git pull origin main
git revert <commit-sha>
git push origin main
# → Redeploy from main
```

For multiple commits, revert them in reverse order (newest first), or use:
```bash
git revert <oldest-sha>..<newest-sha>
```

---

## Database Migrations

Every schema change must be a versioned migration file. No ad-hoc SQL in the Supabase editor without a file.

### Structure

```
supabase/migrations/
  YYYYMMDDHHMMSS_description.sql          ← forward migration
  YYYYMMDDHHMMSS_description.rollback.sql ← rollback
```

### Apply a migration

Run the `.sql` file in the **Supabase SQL editor** (or via `supabase db push` if using Supabase CLI).

### Roll back a migration

1. Run the corresponding `.rollback.sql` in the Supabase SQL editor
2. Fix the issue in a new migration file (do not edit the old one)
3. Re-apply the new migration

> **WARNING**: Rollback scripts destroy data. Always export/backup the affected tables first:
> `COPY table_name TO '/tmp/backup.csv' CSV HEADER;`
> Or use Supabase dashboard → Table Editor → Export.

### Creating a new migration

```bash
# Name format: YYYYMMDDHHMMSS_what_changed
# Example:
touch supabase/migrations/20250306120000_add_shipping_zones.sql
touch supabase/migrations/20250306120000_add_shipping_zones.rollback.sql
```

Write the forward SQL in the first file. Write the exact inverse (DROP/ALTER to undo) in the rollback file.

---

## Pre-Push Checklist

Run this before every push:

```bash
npm run ci   # typecheck + lint + build
```

All three must pass. CI will enforce this on PRs, but catching it locally saves time.

---

## Secrets

The CI build requires these GitHub repository secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Set them in: GitHub → Repository → Settings → Secrets and variables → Actions.

For staging, ideally point these at a **separate Supabase project** so staging data never touches production.
