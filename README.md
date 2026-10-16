# NDS Environmental Solutions Website

Website for NDS Environmental Solutions, LLC (NDSES), a locally owned trash, recycling, and dumpster rental company in Delavan, Wisconsin.

## What's in this repo

| Path | What it is | Status |
| --- | --- | --- |
| `wordpress/ndses-theme` | Classic WordPress theme | **Live site** on Flywheel (`ndses.flywheelsites.com`) |
| `wordpress/ndses-cms` | Plugin: custom post types, Site Settings screen, ACF field groups (`acf-json/`), form submissions, PayEngine settings | Required by the theme |
| `app/`, `components/`, `lib/`, `types/` | Next.js 15 (App Router) frontend that can read WordPress headlessly | Not deployed; kept at content parity with the theme |
| `tests/` | Vitest unit tests for the Next.js app | |
| `docs/` | Editor guide, handoff sheet, and technical notes | See below |

**The WordPress theme is the production site.** A change only reaches visitors once it's in `wordpress/` and deployed to Flywheel. When you change content or behavior, update the theme and the Next.js app together so they don't drift apart (for example, dumpster data lives in both `wordpress/ndses-theme/inc/data.php` and `lib/cms/mock-data.ts`).

## Documentation

- [`docs/NDSES_HANDOFF.md`](docs/NDSES_HANDOFF.md): one-page handoff sheet for NDSES staff
- [`docs/EDITOR_GUIDE.md`](docs/EDITOR_GUIDE.md): full wp-admin guide for NDSES staff
- [`wordpress/README.md`](wordpress/README.md): installing the theme and plugin on Flywheel
- [`docs/README.md`](docs/README.md): Next.js setup, preview/revalidation, PayEngine, Cloudflare checklist
- [`docs/wordpress-content-map.md`](docs/wordpress-content-map.md): which WordPress fields feed which part of the site
- [`docs/CONTENT_SOURCES.md`](docs/CONTENT_SOURCES.md): where the content and images came from

## WordPress (live site)

Requirements: WordPress, **ACF Pro**, and (only for the headless Next.js app) WPGraphQL plus WPGraphQL for ACF.

1. Upload `wordpress/ndses-cms` to `wp-content/plugins/` and activate **NDSES CMS Structure**.
2. Upload `wordpress/ndses-theme` to `wp-content/themes/` and activate it.
3. In **ACF → Field Groups**, click **Sync** for any field groups marked "Sync available". Field groups are version-controlled in `wordpress/ndses-cms/acf-json`, so commit any field changes made in wp-admin.
4. Follow the page and menu setup in [`wordpress/README.md`](wordpress/README.md).

To deploy theme or plugin changes, upload the changed folder to Flywheel over SFTP (or zip it and upload through **Appearance → Themes / Plugins → Add New**). Then load the affected pages and do a hard refresh.

When a section has no CMS content yet, the theme falls back to seed data in `wordpress/ndses-theme/inc/data.php`. Content entered in wp-admin always wins over the seed data.

## Next.js app (local development)

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site runs at http://localhost:3000. With no WordPress variables set, it uses the local content in `lib/cms/mock-data.ts`. Set `WORDPRESS_API_URL` / `WORDPRESS_GRAPHQL_URL` to read live CMS content instead.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint (zero warnings allowed) |
| `npm test` | Vitest unit tests |

Run `typecheck`, `lint`, `test`, and `build` before committing.

## Environment variables

All are listed in `.env.example`. Server-only secrets (`PAYENGINE_SECRET_KEY`, `PAYENGINE_WEBHOOK_SECRET`, `WORDPRESS_*_SECRET`) must never get a `NEXT_PUBLIC_` prefix. On the live WordPress site, PayEngine and reCAPTCHA keys are entered in wp-admin, not in env files (see the editor guide).

## Key code locations

| Area | Next.js | WordPress theme |
| --- | --- | --- |
| Content / seed data | `lib/cms/mock-data.ts` | `inc/data.php` |
| CMS mapping | `lib/cms/wordpress.ts` | `inc/template-tags.php` |
| Dumpster calculator rules | `lib/dumpsterRules.ts` | `assets/js/theme.js` |
| Forms | `app/api/forms`, `lib/validation/forms.ts` | `ndses/v1/forms` REST route in `wordpress/ndses-cms/ndses-cms.php` |
| Payments | `lib/payments/payengine.ts`, `app/api/payments/*` | `template-parts/page-make-a-payment.php` + `ndses/v1/payments/charge` in the plugin |
| Service notices | `lib/notices.ts` | `service_notice` post type |
| Images | `public/nds-assets/` | `assets/images/` |

## License

See [LICENSE](LICENSE).
