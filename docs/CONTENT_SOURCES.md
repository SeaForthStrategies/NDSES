# NDS Website Content Sources

This frontend uses the client-provided `NDS Website Redesign  (1) (1).xlsx` workbook as the primary source of truth.

## Client-Supplied Content

- Page structure, service copy, FAQs, contact details, payment placeholders, service areas, schedule notes, and integration requirements come from the workbook.
- Embedded workbook images were extracted into `public/nds-assets/`.
- The extracted image manifest is available at `public/nds-assets/manifest.md`.

## Image Rights Note

No third-party stock photography is intentionally used in the frontend. The primary visual assets are logos, truck images, dumpster graphics, service-calendar graphics, and map graphics embedded in the client-supplied workbook.

Before launch, NDS Environmental Solutions should confirm that it owns or has permission to use every supplied logo, vehicle photo, dumpster image, calendar graphic, map, and document screenshot.

## Placeholder / Future Integration Sources

- WordPress/ACF will eventually replace the local structured content layer.
- PayEngine will eventually provide the hosted payment flow.
- Form submissions will eventually connect to an approved backend, webhook, CRM, or email service.
- Google Maps or another approved map source may eventually replace the current lightweight service-area visualization.
- Facebook/Instagram links and alert publishing should use official NDS-owned accounts only.
