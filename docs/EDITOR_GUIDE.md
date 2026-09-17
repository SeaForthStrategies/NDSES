# NDSES Website Guide

This guide is for NDS Environmental Solutions staff who will manage the website's content day to day. Everything you edit lives in **WordPress** — a standard, familiar admin dashboard, not code. You don't need to know how to program anything in this guide.

If a question isn't answered here, see [Who to Contact](#who-to-contact) at the bottom.

## Contents

- [Logging In](#logging-in)
- [How Editing Works](#how-editing-works)
- [Self-Check Checklist](#self-check-checklist)
- [Site Settings — Your Company Info](#site-settings--your-company-info)
- [Editing Page Content](#editing-page-content)
- [Managing Services](#managing-services)
- [Managing Communities (Residential Service Areas)](#managing-communities-residential-service-areas)
- [Managing Dumpster Sizes](#managing-dumpster-sizes)
- [Managing FAQs](#managing-faqs)
- [Managing Documents](#managing-documents)
- [Managing Service Areas & Schedules (the coverage map)](#managing-service-areas--schedules-the-coverage-map)
- [Posting Alerts & Notices](#posting-alerts--notices)
- [Viewing Contact Form Submissions](#viewing-contact-form-submissions)
- [Accepting Payments (PayEngine)](#accepting-payments-payengine)
- [Common Questions](#common-questions)
- [Who to Contact](#who-to-contact)

---

## Logging In

Go to `https://ndses.flywheelsites.com/wp-admin` and sign in with the account your developer set up for you. If you don't have a login yet, or you're locked out, contact your developer — see [Who to Contact](#who-to-contact).

Once logged in, everything below is reached from the black menu on the left side of the screen.

## How Editing Works

Every piece of content on the site — page text, service descriptions, FAQs, dumpster sizes, alerts — is edited using **ACF (Advanced Custom Fields)**. In practice this just means: open the item you want to change, you'll see a form with clearly labeled boxes (text fields, image pickers, on/off switches, dropdowns), fill them in, and click **Publish** or **Update** in the top-right corner. Nothing is saved until you click that button.

A few things that are true everywhere:

- **Nothing goes live until you click Publish/Update.** You can leave a page half-edited and come back later — WordPress keeps it as a draft.
- **Changes appear on the live site within a few minutes**, not instantly. If you don't see your change right away, wait 5 minutes and refresh. (See [Common Questions](#common-questions) if it still hasn't shown up.)
- **Required fields are marked** and the Publish button will tell you if something's missing.

## Self-Check Checklist

Use this to confirm the site is set up correctly and everything is working, without needing to ask your developer. It's organized to match the sections below — if a step doesn't make sense, click through to that section for details. Nothing here requires technical knowledge; it's all things you can see and click yourself.

**Access**
- [ ] I can log in at `https://ndses.flywheelsites.com/wp-admin`
- [ ] I can see the full black admin menu on the left (Pages, Services, Communities, Dumpster Sizes, FAQs, Documents, Service Notices, Service Areas, Schedule Items, Form Submissions, Site Settings)

**Company info** — [Site Settings](#site-settings--your-company-info)
- [ ] Phone number is correct
- [ ] Email address is correct (this is also where form submissions get emailed — see below)
- [ ] Facility address and mailing address are both correct
- [ ] Office hours are accurate
- [ ] Facebook URL and Instagram URL point to your real pages (not left blank or placeholder)
- [ ] Header logo and footer logo both look right
- [ ] Footer description and copyright text read correctly

**Page content** — [Editing Page Content](#editing-page-content)
- [ ] Home, About, Contact, Commercial, and Dumpster Rentals pages all have a heading, description, and image in their Hero
- [ ] I opened Page Sections on at least one page and understand how to add/reorder a section

**Services, communities, sizes, FAQs**
- [ ] All three [Services](#managing-services) (Residential, Commercial, Dumpster Rentals) have a summary and image
- [ ] Every [Community](#managing-communities-residential-service-areas) you serve has the correct service day, trash schedule, and recycling schedule
- [ ] Every [Dumpster Size](#managing-dumpster-sizes) you offer is listed with correct capacity, dimensions, and rental period
- [ ] [FAQs](#managing-faqs) cover the real questions customers ask, sorted into the right category (Dumpster, Residential, Commercial)

**Coverage map & schedule** — [Service Areas & Schedules](#managing-service-areas--schedules-the-coverage-map)
- [ ] Every town/county you service has a Service Area entry with the right Service Types checked
- [ ] The map on the Home/About/Commercial pages shows a dot in roughly the right place for each area

**Payments** — [Accepting Payments](#accepting-payments-payengine)
- [ ] I know where the Make a Payment page is, and I have NOT touched the PayEngine Secret Key field
- [ ] I've asked my developer to confirm whether the payment page is in test mode or live mode before real customers use it

**Contact form** — [Viewing Contact Form Submissions](#viewing-contact-form-submissions)
- [ ] I submitted a test entry through the Contact page myself
- [ ] I received the notification email for it
- [ ] I can see it listed under Form Submissions, and clicking it shows the full message

**Alerts** — [Posting Alerts & Notices](#posting-alerts--notices)
- [ ] I created one test Service Notice, saw it appear on the site, then set it to Resolved (or deleted it) to confirm I know the full cycle

Once every box is checked, the content side of the site is in your hands — you shouldn't need a developer for day-to-day updates.

## Site Settings — Your Company Info

**Menu: Site Settings**

This is the one screen that controls information shown across the *entire* site — footer, contact page, schema data search engines read, etc. Update it here once and it updates everywhere.

| Field | What it controls |
| --- | --- |
| Company Name / Legal Name | Displayed name vs. official registered name |
| Phone / Email | Shown in the header, footer, and contact page |
| Facility Address / Mailing Address | Contact page and footer |
| Office Hours | A repeatable list — click "Add Row" to add a line, e.g. "Monday–Thursday: 8am–4pm" |
| Service Area Summary | The one-line description of your coverage area |
| Facebook URL / Instagram URL | Powers the social icons in the footer |
| Header Logo / Footer Logo | Upload a new logo image to replace either |
| Footer Description | The short blurb under your logo in the footer |
| Copyright Text | The line at the very bottom of every page |
| Social Links | A repeatable list of label + URL pairs shown in the footer |

At the bottom of this screen you'll also see a few **Integration Status** fields (PayEngine Status, Form Backend Status, Google Maps Status, Facebook Alert Sync Status, Calendar Integration Status). These are informational notes for your developer, not switches — changing them doesn't turn anything on or off. Leave them alone unless your developer asks you to change one.

## Editing Page Content

**Menu: Pages → pick a page (Home, About, Contact, etc.)**

Each page has two things you can edit:

1. **Hero** — the big banner at the top of the page: eyebrow text, heading, description, and an optional image.
2. **Page Sections** — the building blocks that make up the rest of the page. Click "Add Row" to add a new section, choose a layout, and fill it in. Drag sections by the move handle to reorder them. Available layouts:
   - **Hero** — a secondary banner mid-page
   - **Text and Image** — a heading, rich text, and an image side by side
   - **FAQ Section** — pick existing FAQs to display (see [Managing FAQs](#managing-faqs))
   - **Service Grid** — pick existing Services to display as cards
   - **Accepted / Prohibited Materials** — a simple heading + text block
   - **Process Steps** — a numbered list of steps (e.g. "How rental works")

There's also an **SEO Title** and **SEO Description** field near the bottom of each page — this is what shows up in Google search results, separate from the page's visible heading.

## Managing Services

**Menu: Services**

These are your three core service lines (Residential, Commercial, Dumpster Rentals) shown as cards on the homepage and in the Service Grid page section. Each entry has a summary, hero description, and image.

## Managing Communities (Residential Service Areas)

**Menu: Communities**

One entry per town/city you service (e.g. Town of Walworth, City of Delavan). Each has:

- Service Day, Trash Schedule, Recycling Schedule
- Content Items — a flexible list for things like service guidelines
- Material Lists — accepted/not-accepted items, grouped under a heading (e.g. "Accepted Recycling")

## Managing Dumpster Sizes

**Menu: Dumpster Sizes**

One entry per roll-off size you offer (10/12 Yard, 15 Yard, 20 Yard, 30 Yard, etc.): capacity, dimensions, rental period, an image, and a credit-card-fee note if applicable.

## Managing FAQs

**Menu: FAQs**

Each FAQ has a Question, an Answer (rich text — you can bold, link, and add lists), a Category (**Dumpster**, **Residential**, or **Commercial**), and a Sort Order number for controlling display order within its category. FAQs entered here can be pulled into any page via the FAQ Section page layout.

## Managing Documents

**Menu: Documents**

Downloadable files (flyers, policy PDFs, etc.) that can be linked from any page.

## Managing Service Areas & Schedules (the coverage map)

**Menu: Service Areas** and **Menu: Schedule Items**

**Service Areas** power the coverage map shown on the Home, About, and Commercial pages. Each entry is a town or county with:
- County name
- Service Types (check any combination of **Residential**, **Commercial**, **Temporary roll-off / dumpster rentals**)
- Map X/Y Position — these are percentage coordinates (0–100) placing the dot on the schematic map. If a new entry looks off-position, nudge these numbers and refresh — ask your developer if you're not sure what to enter.

**Schedule Items** are individual calendar entries — Regular pickup, Holiday, Delayed service, or Special date — with a date and description.

## Posting Alerts & Notices

**Menu: Service Notices**

Use this for anything time-sensitive: weather delays, holiday closures, service restorations, emergency announcements. Each notice is organized into tabs at the top of the entry:

- **Notice Content** — the public title, a short summary, full details (rich text), and Internal Notes (visible only to staff in wp-admin, never shown publicly)
- **Status and Priority** — turn **Notice Enabled** on, set **Notice Status** (Draft, Scheduled, Active, Resolved, Expired), and **Notice Priority** (Informational, Standard, Important, Urgent, Emergency) — priority affects styling/prominence
- **Timing** — set Display Start / Display End dates, or turn on **Show Until Manually Resolved** if you don't know the end date yet (you'll turn it off or set Notice Status to Resolved when it's over)
- **Display Locations** — check every place this notice should appear: Site-wide announcement bar, Modal popup, Home page, Residential page, Commercial page, Dumpster rental page, Special-events page, Community pages, Contact page, Payment page, and/or the Service-notices archive. You can also target specific **Affected Communities**.
- **Announcement Bar** — the short text shown if you selected the site-wide banner
- **Popup Settings** — turn on a modal popup and optionally require visitors to acknowledge it before dismissing

**To end a notice:** change Notice Status to Resolved (or Expired), or simply turn Notice Enabled off, then Update.

## Viewing Contact Form Submissions

**Menu: Form Submissions**

Every time someone fills out a form on the site (Contact, Commercial quote request, Dumpster Rentals request, Special Event request, etc.), two things happen automatically:

1. **You get an email** at the address set in Site Settings → Email, with the sender's info and a Reply-To set to them — you can just hit reply.
2. **It's also saved here** as a permanent record, in case an email is ever missed or lands in spam.

Click into any submission to see everything they entered — name, email, phone, service type, address, and their message — plus the Email, Phone, and Service Type columns on the list screen let you scan submissions without opening each one.

## Accepting Payments (PayEngine)

**Menu: Pages → Make a Payment**

The payment page uses a service called PayEngine to securely process credit card and bank payments — card/account numbers are entered directly into PayEngine's secure fields and never touch this website or its database.

The one thing specific to this page: in the page's right-hand **Settings** panel (not the main content area) there's a **PayEngine Secret Key** field. This is a real credential, not content — treat it like a password. Only your developer should need to touch this, typically once during setup or if the key is ever rotated. Don't share it or paste it anywhere outside this field.

For anything about switching between test and live payments, transaction fees, or refunds, talk to your developer or PayEngine support directly — this isn't something to change from the content side.

## Common Questions

**I published a change but don't see it on the live site.**
Give it about 5 minutes — content is cached briefly for speed. If it still hasn't appeared after that, try a hard refresh (Cmd+Shift+R / Ctrl+Shift+R), and if it's still missing, contact your developer.

**How do I add a new FAQ to a page?**
Create the FAQ under the FAQs menu first (with the right Category), then go to the page, add an "FAQ Section" layout in Page Sections, and pick it from the list.

**How do I post a weather delay or closure notice?**
See [Posting Alerts & Notices](#posting-alerts--notices) above — that's the Service Notices menu.

**Someone submitted the contact form — where do I see what they wrote?**
Check your email first (it's sent automatically), or open **Form Submissions** in the left menu — see [above](#viewing-contact-form-submissions).

**Can I change our phone number, hours, or address myself?**
Yes — Site Settings, no developer needed.

**I forgot my password.**
Use the "Lost your password?" link on the wp-admin login screen.

**Can I edit the PayEngine secret key or payment settings?**
You can, but shouldn't unless your developer walks you through it — see [Accepting Payments](#accepting-payments-payengine).

**Do I need to touch the "Integration Status" fields in Site Settings?**
No — those are informational notes for developers, not real switches.

## Who to Contact

For anything beyond day-to-day content edits — new page types, design changes, payment/PayEngine configuration, technical errors, or account access — contact Abby Lehr at **abby.lehr@radicalsurfaces.com**.
