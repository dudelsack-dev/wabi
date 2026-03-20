# Contributing to Wabi

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | **Production** — stable, deployed code only |
| `dev`  | **Development** — all active work happens here |

## Workflow

1. **All development goes on `dev`** (or a short-lived `feature/xyz` branch off `dev`)
2. **Test your changes** on `dev` before promoting
3. **Open a Pull Request** from `dev` → `main` when code is tested and ready for production
4. **Never push directly to `main`**

```
feature/xyz  ──► dev ──── (tested & reviewed) ──── PR ──► main (prod)
```

## Branching Quick Reference

```bash
# Start new work
git checkout dev
git pull origin dev
git checkout -b feature/my-feature

# Finish work — merge back to dev
git checkout dev
git merge feature/my-feature
git push origin dev

# Release to production — open a PR: dev → main (via web UI)
```

## Branch Protection

- `main` is protected: direct pushes are blocked, PRs required
- `dev` is the default branch for new PRs
