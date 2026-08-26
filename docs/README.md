# NDSES Website Documentation

This project is a Next.js App Router frontend for NDS Environmental Solutions with WordPress/Flywheel as a headless CMS.

## Local Development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill WordPress, PayEngine, analytics, map, form, and CAPTCHA values as they become available.
4. Run `npm run dev`.
5. Run validation with `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.

## WordPress Setup

Install the plugin in `wordpress/ndses-cms` on the Flywheel WordPress site. It registers custom post types for services, communities, dumpster sizes, FAQs, documents, and service notices. It also configures ACF JSON load/save paths.

Required WordPress plugins:

- Advanced Custom Fields Pro
- WPGraphQL
- WPGraphQL for ACF, if selected for the final data layer

## ACF Synchronization

The starter field groups live in `wordpress/ndses-cms/acf-json`. After installing the plugin and ACF Pro, open ACF Field Groups and sync available JSON groups. Keep field changes version-controlled by committing updated JSON files.

## Preview and Revalidation

Use `WORDPRESS_PREVIEW_SECRET` for draft preview links and `WORDPRESS_REVALIDATION_SECRET` for the webhook that calls `/api/revalidate`. A service notice update should revalidate home, service notices, affected community pages, affected service pages, and global layout data.

## PayEngine Setup

The current code includes a secure placeholder layer. It will not accept real payments until NDSES provides:

- Merchant identifier
- API endpoint
- Public credential
- Secret credential
- Webhook secret
- Required transaction fields
- Test account
- Production account

Secrets must remain server-side. Never store raw card data in WordPress.

## Forms

Forms post to `/api/forms` and validate on both client and server. Configure `FORM_WEBHOOK_URL` or `FORM_NOTIFICATION_EMAIL` before launch. Add CAPTCHA keys when spam prevention is activated.

## Analytics

Use the centralized `lib/analytics.ts` utility. Do not scatter direct GTM, GA4, or Clarity calls across components.

## Cloudflare Checklist

- Point DNS to Vercel and Flywheel as appropriate.
- Enable SSL and HTTPS redirects.
- Configure WAF, bot protection, rate limiting, and threat monitoring.
- Cache static assets aggressively.
- Protect WordPress API endpoints from abusive traffic while allowing Vercel builds and revalidation.
- Restrict staging and development environments.

## Deployment

Deploy Next.js to Vercel. Deploy WordPress to Flywheel. Content updates should flow through WordPress and trigger revalidation, not Vercel redeployments.
