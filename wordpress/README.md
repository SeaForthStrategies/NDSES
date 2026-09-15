# NDSES WordPress Build

This folder contains the WordPress implementation path for the NDS Environmental Solutions site.

## Install on Flywheel

1. Install WordPress on Flywheel.
2. Install and activate ACF Pro.
3. Upload `wordpress/ndses-cms` as a plugin and activate it.
4. Upload `wordpress/ndses-theme` as the active theme.
5. In WordPress admin, go to ACF and sync the local JSON field groups from `wordpress/ndses-cms/acf-json`.
6. Create the public pages with these slugs:
   - `/`
   - `/residential`
   - `/commercial`
   - `/dumpster-rentals`
   - `/dumpster-calculator`
   - `/faqs`
   - `/about`
   - `/contact`
   - `/make-a-payment`
   - `/whats-new`
7. Set the homepage as the static front page.
8. Build the Primary Navigation menu and assign it to the theme's Primary Navigation location.

## Integration Safety

- TODO: ACF - The theme currently has spreadsheet-based fallback content in `wordpress/ndses-theme/inc/data.php`. Replace it progressively with ACF option fields, page fields, and custom post type entries.
- TODO: PayEngine - The payment page is a non-processing placeholder. Do not collect real card or ACH information until PayEngine is connected and tested.
- TODO: Form Backend - Contact/payment forms validate locally only. Connect the final email, CRM, or webhook destination before launch.
- TODO: Facebook - Alerts and social links are modeled, but Facebook auto-posting is not connected.
- TODO: ACF - Google Maps/service-area coordinates are static placeholders until final map data and API keys are supplied.

## Media

The theme includes client-supplied and spreadsheet-extracted images in `wordpress/ndses-theme/assets/images`. Do not replace missing media with copyrighted stock images. When new images are supplied, upload them to the WordPress Media Library and connect them through ACF fields.

