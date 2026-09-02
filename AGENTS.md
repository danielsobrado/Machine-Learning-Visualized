@C:\Users\User\.codex\RTK.md

# Repository Notes

## GitHub Pages Publishing

This repository publishes the unified app manually from the local machine. Do not add or rely on a GitHub Actions Pages workflow for this repo.

Use the repo skill at `.agents/skills/publish-github-pages/SKILL.md` when the user asks to publish, deploy, update, or refresh GitHub Pages.

The manual deploy command is:

```bash
rtk node scripts/deploy-github-pages.mjs
```

The script builds `unified-app` and publishes `unified-app/dist` to the `gh-pages` branch. GitHub Pages should be configured once in repository settings as:

- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/ (root)`

## Visual Theme Audit

The unified app uses a Cloudflare-inspired product UI: neutral white/gray surfaces, thin borders, compact controls, restrained shadows, small radii, dense navigation, and orange only as a focused accent. The shared override lives in `unified-app/src/styles/cloudflare-theme.css`.

Use the repo skill at `.agents/skills/visual-theme-audit/SKILL.md` when the user asks to check every screen, capture Playwright screenshots, inspect visual theme consistency, or fix contrast/alignment/button/tab discrepancies.

The audit command is:

```bash
rtk node .agents/skills/visual-theme-audit/scripts/audit-unified-app.mjs
```

## SEO Coverage

All public pages are expected to be SEO-ready. This includes:

- Static pages in each animation directory (`*-animation/index.html`) with core metadata (`title`, description, canonical, Open Graph, Twitter).
- Unified app entry page (`unified-app/index.html`) with matching base metadata.
- Route-aware metadata updates inside `unified-app/src/App.jsx` for dynamic routes (`/`, `/animation/:id`, `/glossary/:slug`) so crawlers see route-specific titles and descriptions.
