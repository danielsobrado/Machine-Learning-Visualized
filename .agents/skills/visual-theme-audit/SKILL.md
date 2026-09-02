---
name: visual-theme-audit
description: Audit ml-animations unified-app visual surfaces with Playwright screenshots. Use when the user asks to inspect every screen, check theme consistency, review contrast/alignment/buttons/tabs, capture screenshots, or fix Cloudflare-inspired styling discrepancies across the catalog.
---

# Visual Theme Audit

Use this skill for repo-local visual QA of the `unified-app` Cloudflare-inspired product theme.

## Workflow

1. Run the screenshot audit script from the repo root:

   ```bash
   rtk node .agents/skills/visual-theme-audit/scripts/audit-unified-app.mjs
   ```

2. Inspect the generated output under `screenshots/theme-audit/<timestamp>/`:
   - `manifest.json` lists every captured screen and any automated theme findings.
   - `home/` contains home page desktop/mobile captures plus a mobile menu-open capture.
   - `animations/<animation-id>/` contains one capture for the default screen and one per visible tab.

3. Review screenshots in batches. Prioritize:
   - bright or saturated chrome outside visualization content
   - gradients, oversized pills, heavy shadows, dark application panels, or white-on-saturated cards
   - controls that do not use the neutral white/gray shell with the restrained orange accent
   - inconsistent 6-10 px radii, borders, spacing, button heights, or selected states
   - misaligned two-column labs, charts clipped out of panels, labels outside SVG/canvas bounds
   - text contrast that is too faint on white/gray surfaces
   - mobile screenshots where header/sidebar/page content overlap

4. Patch the source, not generated `dist`. Prefer:
   - shared shell and product-theme fixes in `unified-app/src/styles/cloudflare-theme.css`
   - shared compatibility fixes in `unified-app/src/index.css` only when they are not theme-specific
   - focused component CSS/classes for one-off visualization layouts
   - existing `Tabs`, `Btn`, `ParamSlider`, `Figure`, and `Aside` primitives when touching components

5. Re-run:

   ```bash
   rtk npm run build --prefix unified-app
   rtk node .agents/skills/visual-theme-audit/scripts/audit-unified-app.mjs
   ```

6. Commit source and skill changes. If the user expects GitHub Pages to update, run:

   ```bash
   rtk node scripts/deploy-github-pages.mjs
   ```

## Theme Rules

- Application chrome is neutral white/gray with thin `#e5e7eb`-style borders.
- Orange is an accent for active/focused states, progress, and important emphasis, not a large background.
- Prefer 6-10 px radii and `0 1px 2px rgba(0,0,0,.04)`-level shadows.
- Keep typography compact and sans-serif. Large editorial serif headings are not part of the current theme.
- Sidebar and top navigation should remain dense and predictable.
- Prerequisite/knowledge graphs should look like operational resource diagrams: white nodes, orthogonal gray connectors, dotted canvas, and subtle selected states.
- Visualization content may keep semantic chart colors when those colors encode data.

## Notes

- The script requires `playwright` in `unified-app` dev dependencies. It uses the local Chrome channel by default; set `THEME_AUDIT_CHANNEL=msedge` or `THEME_AUDIT_CHANNEL=chromium` if needed.
- Keep generated screenshots uncommitted unless the user asks for snapshot artifacts.
- Treat automated findings as triage hints; visual inspection decides whether a screen is acceptable.
