# NDSES Website Guide

This guide is for NDS Environmental Solutions staff who will manage the website's content day to day. Everything you edit lives in **WordPress** — a standard, familiar admin dashboard, not code. You don't need to know how to program anything in this guide.

If a question isn't answered here, see [Who to Contact](#who-to-contact) at the bottom.

## Contents

- [Logging In](#logging-in)
- [How Editing Works](#how-editing-works)
- [Self-Check Checklist](#self-check-checklist)
- [Site Settings — Your Company Info](#site-settings--your-company-info)
- [Editing Page Content](#editing-page-content)
- [Managing Communities (Residential Service Areas)](#managing-communities-residential-service-areas)
- [Managing Dumpster Sizes](#managing-dumpster-sizes)
- [Managing Commercial Containers](#managing-commercial-containers)
- [Managing FAQs](#managing-faqs)
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
- [ ] I can see the full black admin menu on the left (Pages, Communities, Dumpster Sizes, Commercial Containers, FAQs, Service Notices, Service Areas, Form Submissions, Site Settings)

**Company info** — [Site Settings](#site-settings--your-company-info)
- [ ] Phone number is correct
- [ ] Email address is correct (this is also where form submissions get emailed — see below)
- [ ] Facility address and mailing address are both correct
- [ ] Office hours are accurate
- [ ] Facebook URL and Instagram URL point to your real pages (not left blank or placeholder)
- [ ] Header logo and footer logo both look right
- [ ] Footer description and copyright text read correctly
- [ ] Mission Statement and About Page: Our Story read correctly

**Page content** — [Editing Page Content](#editing-page-content)
- [ ] Home, About, Contact, Commercial, and Dumpster Rentals pages all have a heading, description, and image in their Hero

**Communities, sizes, containers, FAQs**
- [ ] Every [Community](#managing-communities-residential-service-areas) you serve has the correct service day, trash schedule, and recycling schedule
- [ ] Every [Dumpster Size](#managing-dumpster-sizes) you offer is listed with correct capacity, dimensions, Ideal For list, and image
- [ ] Every [Commercial Container](#managing-commercial-containers) you offer is listed with correct dimensions, capacity, and image
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
| Office Hours | One line per row, e.g. "Monday - Thursday: 8:00am - 4:00pm" (press Enter between lines) |
| Service Area Summary | The one-line description of your coverage area |
| Facebook URL / Instagram URL | Powers the social icons in the footer |
| Header Logo / Footer Logo | Upload a new logo image to replace either |
| Footer Description | The short blurb under your logo in the footer |
| Copyright Text | The line at the very bottom of every page |
| Mission Statement | The "Our Mission" box on the Home and About pages |
| About Page: Our Story | The company history on the About page. Leave blank to keep the current text |

At the bottom of this screen you'll also see a few **Integration Status** fields (PayEngine Status, Form Backend Status, Google Maps Status, Facebook Alert Sync Status, Calendar Integration Status). Most of these are informational notes for your developer, not switches — changing them doesn't turn anything on or off. **PayEngine Status is the exception**: it's a real switch, and it sits next to the actual PayEngine credential fields (Public Key, API Host, Server API URL, Merchant ID) — see [Accepting Payments](#accepting-payments-payengine) before touching any of these.

## Editing Page Content

**Menu: Pages → pick a page (Home, About, Contact, etc.)**

Each page's **Hero** — the big banner at the top — is editable: eyebrow text, heading, description, and an optional image. Leave a box blank to keep the site's current text for it.

The rest of each page's layout (section order, service cards, the "Why NDS" block, accepted/prohibited materials lists) is built into the site's design. Text that changes often is pulled from the menus below — Site Settings, Dumpster Sizes, Commercial Containers, FAQs, Service Notices, Service Areas, and Communities. For a layout or wording change outside those, contact your developer.

> **Note:** You may see a **Page Sections** box on page edit screens. It requires the paid ACF PRO plugin, which this site doesn't use, so it has no effect — ignore it.

**Special Events, Privacy Policy, and Terms** are ordinary pages edited the same way as any other page listed above — Special Events also has its own inquiry form (formType "event") like Commercial and Dumpster Rentals do. Privacy Policy and Terms currently hold placeholder legal text pending formal review — replace it with NDSES's actual reviewed policy before relying on it.

## Managing Communities (Residential Service Areas)

**Menu: Communities**

One entry per town/city you service (e.g. Town of Walworth, City of Delavan). Each has:

- **Service Day, Trash Schedule, Recycling Schedule** — these update the community's page and the Residential page.

The entry's **slug** (the part of its URL, e.g. `town-of-walworth`) must match the community's existing page address for its schedule to show. The five current communities are Town of Walworth, Town of Delavan, City of Delavan, Town of Darien, and Town of Sharon. Adding a brand-new community, or changing its recycling and bulk-item lists, is a developer change.

## Managing Dumpster Sizes

**Menu: Dumpster Sizes**

One entry per roll-off size you offer (10 Yard, 12 Yard, 15 Yard, 20 Yard, 30 Yard): Capacity (or Truck Loads), Dimensions, an Image (the dimension graphic), plus **Ideal For** and **Included** lists — type one item per line. Use the **Order** box (right-hand sidebar) to control the order sizes appear in: 1, 2, 3…

> **Important:** until at least one Dumpster Size is published, the site shows its built-in sizes. As soon as you publish one, the site shows *only* published entries — so enter all five sizes before publishing any, or publish them together.

## Managing Commercial Containers

**Menu: Commercial Containers**

The permanent dumpster options on the Commercial page (96 Gallon, 2 Yard, 4 Yard, 6 Yard, 8 Yard). Each entry has a title (e.g. "4 Yard"), Description, Dimensions, Capacity, a Dimension Graphic image, and an **Ideal For** list (one item per line). Use the **Order** box to set display order.

Same rule as dumpster sizes: the built-in list shows until you publish your first entry, then only published entries show — enter all of them before publishing.

**Note on the Dumpster Calculator tool** (the "recommend a size" quiz on the Dumpster Calculator page): its sizing logic is fixed in the site's code, not editable here in wp-admin. By design, checking **Other Heavy Materials** always caps the recommendation at 10 Yard regardless of project type — heavy materials (concrete, dirt, roofing tear-off) hit a dumpster's weight limit long before it's visually full, so a bigger box wouldn't help. The tool shows an explanatory note whenever that happens. If you ever want the underlying project-type-to-size mapping changed, that's a developer change, not a content edit.

## Managing FAQs

**Menu: FAQs**

Each FAQ has a Question, an Answer (rich text — you can bold, link, and add lists), a Category (**Dumpster**, **Residential**, or **Commercial**), and a Sort Order number for controlling display order within its category. FAQs appear on the FAQs page, and Dumpster/Residential FAQs also appear on the Home and Residential pages.

> **Important:** the built-in FAQs show until you publish your first FAQ here, then only published FAQs show. Re-enter any built-in questions you want to keep.

## Managing Service Areas & Schedules (the coverage map)

**Menu: Service Areas**

**Service Areas** power the coverage map shown on the Home, About, and Commercial pages. Each entry is a town or county with:
- County name
- Service Types (check any combination of **Residential**, **Commercial**, **Temporary roll-off / dumpster rentals**)
- Map X/Y Position — these are percentage coordinates (0–100) placing the dot on the schematic map. If a new entry looks off-position, nudge these numbers and refresh — ask your developer if you're not sure what to enter.

As with FAQs, the built-in areas show until you publish your first Service Area, then only published ones show — enter every area before publishing.

Holiday and delay dates are communicated with [Service Notices](#posting-alerts--notices) and the community calendar downloads; the **Schedule Items** menu isn't used by the site.

## Posting Alerts & Notices

**Menu: Service Notices**

Use this for anything time-sensitive: weather delays, holiday closures, service restorations, emergency announcements. Each notice is organized into tabs at the top of the entry:

- **Notice Content** — the public title, a short summary, full details (rich text), and Internal Notes (visible only to staff in wp-admin, never shown publicly)
- **Status and Priority** — turn **Notice Enabled** on, set **Notice Status** (Draft, Scheduled, Active, Resolved, Expired), and **Notice Priority** (Informational, Standard, Important, Urgent, Emergency) — priority affects styling/prominence
- **Timing** — set Display Start / Display End dates, or turn on **Show Until Manually Resolved** if you don't know the end date yet (you'll turn it off or set Notice Status to Resolved when it's over)
- **Display Locations** — check **Site-wide announcement bar** to show it in the green bar at the top of every page. Every live notice also appears on the **What's New** page. (The other location checkboxes, Affected Communities, and Popup Settings aren't used by the site yet.)
- **Announcement Bar** — the short text shown in the top bar; if blank, the notice title is used

A notice is live when **Notice Enabled** is on, **Notice Status** is **Active** (or **Scheduled** with a start date that has passed), and it's inside its Display Start/End window.

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

**Two places hold PayEngine credentials, both treat their values like passwords — don't share or paste them anywhere else:**

1. **Pages → Make a Payment → edit → right-hand Settings panel → PayEngine Secret Key.**
2. **Site Settings → PayEngine Public Key, PayEngine API Host, PayEngine Server API URL, PayEngine Merchant ID.** (Site Settings also has the **PayEngine Status** dropdown — Test mode / Live.)

**To switch the site from test to real, live payments:**
1. Log in to your actual PayEngine dashboard (not this site) and find your **live-mode** keys under API Keys — they start with `pk_live_` and `sk_live_`, not `pk_test_`/`sk_test_`.
2. Paste the live secret key into the Make a Payment page's Secret Key field (above) and Update.
3. Paste the live public key, API host, server API URL, and merchant ID into the four Site Settings fields above and Update. PayEngine's dashboard will tell you the correct host/API URL for live mode if they differ from sandbox.
4. Only after both of those are saved, set **PayEngine Status** to **Live** and Update.

Until step 4, the site keeps working exactly as before — nothing changes just from filling in the fields. Once "Live" is set with real `pk_live_`/`sk_live_` keys, real customer cards will be charged, so double-check everything before that last step. If anything's unclear, contact your developer rather than guessing.

## Common Questions

**I published a change but don't see it on the live site.**
Give it about 5 minutes — content is cached briefly for speed. If it still hasn't appeared after that, try a hard refresh (Cmd+Shift+R / Ctrl+Shift+R), and if it's still missing, contact your developer.

**How do I add a new FAQ?**
Create it under the FAQs menu with the right Category and publish. It appears on the FAQs page automatically (see the note in [Managing FAQs](#managing-faqs) about the built-in FAQs).

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
