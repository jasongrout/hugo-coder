# Hugo-Coder Theme Migration Notes

## What happened

The hugo-coder theme fork was updated from a very old upstream base (commit `9920a72`, "Bump fork-awesome to 1.2.0") to the current upstream `origin/main` (171 commits ahead). Rather than merging (which had 13 conflicting files), all local customizations were re-applied as 10 clean commits on top of upstream.

## Branch layout

- **`upstream-rebase`** — the new branch with upstream + customizations (this is the active branch)
- **`pre-upstream-merge`** tag — points to the old HEAD before migration, for easy revert
- **`jason/master`** — the old branch, untouched

To revert: `git checkout pre-upstream-merge` or `git checkout jason/master`

## Breaking changes from upstream that affect the site

### 1. Fork Awesome → Font Awesome 6.x

The icon library was completely swapped. All icon references in site config and content must use Font Awesome 6 class syntax:

- Old (Fork Awesome): `fa fa-github`, `fa fa-twitter`, `fa fa-envelope`
- New (Font Awesome 6): `fa-brands fa-github`, `fa-brands fa-x-twitter`, `fa-solid fa-envelope`

**Action needed:** Update all `social` entries in the site's `config.toml`/`hugo.toml` to use the new icon class names. The `icon` field in each social entry needs updating. See https://fontawesome.com/icons for the current icon names.

Common mappings:
- `fa fa-github` → `fa-brands fa-github`
- `fa fa-twitter` → `fa-brands fa-x-twitter` (Twitter is now X)
- `fa fa-linkedin` → `fa-brands fa-linkedin`
- `fa fa-envelope` → `fa-solid fa-envelope`
- `fa fa-rss` → `fa-solid fa-rss`
- `fa fa-mastodon` → `fa-brands fa-mastodon`
- `fa fa-stack-overflow` → `fa-brands fa-stack-overflow`

### 2. Partials directory renamed

Upstream moved `layouts/partials/` to `layouts/_partials/`. Hugo resolves both, but if the **site** has overrides in `layouts/partials/` they should still work. However, if referencing theme partials by path anywhere, be aware of this change.

### 3. `baseof.html` moved

Upstream moved `layouts/_default/baseof.html` to `layouts/baseof.html` (Hugo 0.157+ convention). If the site has its own `layouts/_default/baseof.html` override, it may need to be moved to `layouts/baseof.html`.

### 4. Deleted upstream partials

These partials were deleted upstream (functionality moved elsewhere or removed):
- `layouts/partials/footer.html` → now at `layouts/_partials/footer.html`
- `layouts/partials/home.html` → now at `layouts/_partials/home.html` (with sub-partials in `_partials/home/`)
- `layouts/partials/posts/disqus.html` — removed entirely
- `layouts/partials/posts/math.html` — removed
- `layouts/partials/posts/utterances.html` — removed
- `layouts/partials/csp.html` — removed
- `layouts/shortcodes/notice.html` — removed (moved to `_shortcodes/`)

### 5. Home page structure

The home page partial is now modularized into sub-partials:
- `_partials/home/avatar.html`
- `_partials/home/author.html`
- `_partials/home/social.html`
- `_partials/home/extensions.html`

The social config format uses `params.social` as an array of objects with `name`, `icon`, `url`, `weight`, `rel`, `target` fields. Example:

```toml
[[params.social]]
  name = "GitHub"
  icon = "fa-brands fa-github fa-2x"
  weight = 1
  url = "https://github.com/username"
```

### 6. Breadcrumb partial

The theme now calls `{{ partial "breadcrumb.html" . }}` in `baseof.html` between the header and content. The breadcrumb partial itself is expected to live in the **site's** `layouts/partials/breadcrumb.html` (not in the theme). Make sure this partial still exists in the site repo.

### 7. Home page content from `_index.md`

The home page now renders `{{ .Content }}` from the site's `content/_index.md` file in an `about-description` div. This was a custom feature from the old fork that has been preserved. Make sure `content/_index.md` exists and has the desired content.

### 8. TOC (Table of Contents)

The TOC is enabled per-page with `toc: true` in front matter. It only appears on pages with more than 300 words. It renders as a collapsible `<details>` element that floats to the right on wide screens.

### 9. Hugo minimum version

Upstream now requires Hugo v0.146.0 or later. Make sure your Hugo installation is up to date.

### 10. New upstream features available

The updated theme now supports (via site config):
- Mastodon comments
- Giscus comments
- Many analytics providers (Plausible, Fathom, GoatCounter, Umami, Pirsch, Cloudflare, Vercel, etc.)
- Custom remote JS files
- Tabs shortcode
- Syntax highlighting styles
- SVG favicons
- Fediverse creator meta tag
- Custom head title
