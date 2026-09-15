# NDSES WordPress/ACF Check And Build Plan

## Goal

Launch the current Next.js frontend as the production NDSES website, with Flywheel WordPress acting as the headless CMS. WordPress should power editable content through ACF and WPGraphQL; it should not replace the frontend as a traditional WordPress theme.

The existing Next.js site remains the source of truth for layout, routing, component behavior, styling, validation, and integration boundaries.

## Current Architecture To Preserve

- Frontend: Next.js App Router, React, TypeScript.
- CMS abstraction: `lib/cms/index.ts` and `lib/cms/wordpress.ts`.
- Content types/interfaces: `types/cms.ts`.
- Local fallback/mock data: `lib/cms/mock-data.ts`.
- WordPress plugin starter: `wordpress/ndses-cms`.
- ACF JSON starter groups: `wordpress/ndses-cms/acf-json`.
- Payment placeholder: `lib/payments/payengine.ts`.
- Form placeholder/API route: `app/api/forms/route.ts`.
- Revalidation route: `app/api/revalidate/route.ts`.

## Recommended Build Path

1. Keep the current Next.js frontend intact.
2. Set up Flywheel WordPress as a headless CMS.
3. Install and configure ACF Pro, WPGraphQL, and WPGraphQL for ACF.
4. Install the custom `NDSES CMS Structure` plugin from `wordpress/ndses-cms`.
5. Create/sync ACF field groups to match the frontend TypeScript data model.
6. Populate WordPress with NDSES content from the approved spreadsheet/current local data.
7. Update `lib/cms/wordpress.ts` to map WordPress GraphQL responses into the existing frontend types.
8. Validate every route against WordPress data.
9. Keep PayEngine, form backend, maps, and social integrations behind placeholders until credentials and final business approvals are ready.

## WordPress/Flywheel Setup Checklist

- Create or open the Flywheel WordPress site for NDSES.
- Confirm SSL is active on the Flywheel domain.
- Install required plugins:
  - Advanced Custom Fields Pro
  - WPGraphQL
  - WPGraphQL for ACF
  - NDSES CMS Structure custom plugin
- Upload the custom plugin by zipping `wordpress/ndses-cms`.
- Activate `NDSES CMS Structure`.
- Confirm these custom post types exist:
  - Services
  - Communities
  - Dumpster Sizes
  - FAQs
  - Documents
  - Service Notices
- Confirm the `NDSES Site Settings` options page appears.
- Confirm ACF Local JSON loads from `wordpress/ndses-cms/acf-json`.
- Sync existing ACF JSON groups in WordPress.
- Confirm the GraphQL endpoint is available at `/graphql`.

## ACF Field Group Checklist

All public fields needed by the frontend must have `show_in_graphql` enabled.

### Global Site Settings

Create an ACF options field group for:

- Company name
- Footer description
- Phone
- Email
- Street address
- Mailing address
- Business hours
- Copyright text
- Social links repeater:
  - Label
  - URL
- Navigation repeater:
  - Label
  - URL
  - Description
  - Children repeater

### Page Builder

Expand the existing `NDSES Page Builder` group for WordPress pages:

- Hero group:
  - Eyebrow
  - Heading
  - Description
  - Image
- Flexible sections:
  - Text/image
  - Service grid
  - CTA
  - FAQ section
  - Items/cards section
  - Service-area/map section if needed
  - Schedule/calendar section if needed

### Communities

Create or expand fields for:

- Municipality type
- Summary
- Hero description
- Service day
- Trash schedule
- Recycling schedule
- Bulk policy
- Accepted recycling repeater
- Recycling not accepted repeater
- Never accepted recycling repeater
- Bulk accepted repeater
- Bulk not accepted repeater
- Guidelines repeater
- Related documents
- Related FAQs
- SEO title
- SEO description

### Dumpster Sizes

Create fields for:

- Name
- Slug
- Container type
- Capacity
- Approximate truck loads
- Recommended uses
- Included tonnage
- Rental period
- Delivery/pickup details
- Disposal details
- Dimensions
- Dimension disclaimer
- Image
- Accepted materials repeater
- Prohibited materials repeater
- Included features repeater
- CTA label
- CTA URL

### FAQs

Create fields for:

- Question
- Answer
- Category:
  - Dumpster rentals
  - Residential trash and recycling
  - Commercial trash and recycling
- Sort order
- Related service/page if needed

### Service Notices

Use and expand `group_ndses_service_notice.json`:

- Notice title
- Short summary
- Full details
- Notice enabled
- Notice status
- Notice priority
- Display start
- Display end
- Show until resolved
- Display locations
- Affected communities
- Affected services
- Announcement text
- Popup enabled
- Popup requires acknowledgment

Do not expose internal notes through public frontend queries.

### Service Areas

Create a service-area data structure through CPT or options repeater:

- Name
- Slug
- County
- Service types:
  - Residential
  - Commercial
  - Roll-off/dumpster rentals
- Notes
- Latitude
- Longitude
- Future polygon/GeoJSON field

### Schedules And Calendars

Create a schedule/calendar structure that can represent:

- Regular pickup schedule
- Holiday schedule
- Delayed service
- Special dates
- Related community
- Related document/file
- Public description

## Frontend Integration Checklist

- Add Flywheel values to `.env.local`:
  - `WORDPRESS_GRAPHQL_URL`
  - `WORDPRESS_API_URL`
  - `WORDPRESS_PREVIEW_SECRET`
  - `WORDPRESS_REVALIDATION_SECRET`
- Keep mock data available as fallback during integration.
- Implement WordPress GraphQL queries in `lib/cms/wordpress.ts`.
- Map WordPress responses into the existing interfaces in `types/cms.ts`.
- Do not put large WordPress queries inside React components.
- Do not hardcode new page copy in components.
- Preserve existing routes:
  - `/`
  - `/residential`
  - `/residential/[communitySlug]`
  - `/commercial`
  - `/dumpster-rentals`
  - `/dumpster-calculator`
  - `/faqs`
  - `/about`
  - `/contact`
  - `/make-a-payment`
  - `/whats-new`
  - `/service-notices`
  - `/service-notices/[slug]`
  - `/special-events`
  - `/privacy-policy`
  - `/terms`
- Confirm metadata still renders for each route.
- Confirm structured data still renders for local business and FAQs.
- Confirm sitemap and robots still generate correctly.

## Integration Placeholders To Keep

### PayEngine

Keep PayEngine as a placeholder until NDSES provides final credentials and a test account.

Do not collect, store, or transmit raw card or bank data through the frontend or WordPress.

Files to preserve:

- `lib/payments/payengine.ts`
- `components/payments/PaymentForm.tsx`
- `app/api/payments/create-session/route.ts`
- `app/api/payments/webhook/route.ts`

### Forms

Keep form submission behind the existing API/service boundary until the final backend destination is chosen.

Do not claim forms email NDSES until `FORM_WEBHOOK_URL`, email routing, or CRM routing is configured and tested.

Files to preserve:

- `components/forms/InquiryForm.tsx`
- `app/api/forms/route.ts`
- `lib/validation/forms.ts`

### Maps

Keep the current service-area map as structured local/CMS data until a map provider is approved.

Do not add a heavy map embed without approval.

### Facebook/Social

Keep lightweight social links or structured alert placeholders. Do not add heavy third-party feeds unless explicitly approved.

## Content Migration Checklist

- Populate global settings first.
- Populate primary pages:
  - Home
  - Residential
  - Commercial
  - Dumpster Rentals
  - Dumpster Calculator
  - FAQs
  - About
  - Contact
  - Make a Payment
  - What's New
- Populate communities and confirm community slugs match frontend URLs.
- Populate dumpster sizes and confirm all required fields render.
- Populate FAQs by category.
- Populate service notices and test site-wide, page-specific, and community-specific display logic.
- Upload client-supplied media from the approved NDSES assets.
- Add alt text to every image in WordPress.
- Confirm content-source/legal notes before launch.

## QA Checklist

Run locally before connecting production:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

Check frontend routes:

- Homepage loads with WordPress data.
- Residential page and each community page load.
- Commercial page loads.
- Dumpster rentals page loads.
- Dumpster calculator works.
- FAQ accordions work and FAQ schema is valid.
- Contact/request forms validate correctly.
- Payment page remains placeholder-only.
- Service notices appear only in intended locations.
- Sitemap includes all intended public URLs.
- Robots output is correct.
- No console errors.
- No broken images.
- No horizontal overflow on mobile.
- Header/navigation works on desktop and mobile.
- Calls, quote CTAs, payment CTAs, and internal links work.

## Deployment Checklist

- Confirm the GitHub repo is current.
- Deploy the Next.js frontend to the chosen host, preferably Vercel.
- Add environment variables in the deployment host.
- Confirm Flywheel WordPress is reachable from the deployment host.
- Confirm GraphQL queries work in production.
- Configure revalidation webhook from WordPress to the Next.js deployment.
- Confirm published WordPress edits update the frontend.
- Configure production analytics IDs only after approval.
- Configure form backend only after approval.
- Configure PayEngine only after test-mode approval.
- Configure DNS and SSL.
- Perform final browser QA on production/staging URL.

## Launch Approval Checklist

Do not launch publicly until these are approved:

- NDS confirms all service details, schedules, policies, fees, accepted materials, and prohibited materials.
- NDS confirms image ownership/permission for all supplied assets.
- NDS approves privacy policy and legal/source pages.
- NDS approves payment disclaimer and PayEngine flow.
- NDS approves form routing and notification recipients.
- NDS approves analytics/tracking setup.
- NDS approves final responsive visual QA.

## Done Criteria

The WordPress/ACF build is complete when:

- Flywheel WordPress has the required CPTs, options pages, and ACF field groups.
- ACF fields are version-controlled through local JSON.
- WPGraphQL exposes the approved public fields.
- The Next.js frontend reads WordPress data through `lib/cms/wordpress.ts`.
- Mock data remains available as development fallback.
- The site passes typecheck, lint, tests, and production build.
- Every public route loads with no console errors.
- Payments and forms remain safely behind placeholder/integration boundaries until approved.
- The frontend can be deployed without rebuilding the CMS structure.
