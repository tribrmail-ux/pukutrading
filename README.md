# Puku Trading Trust — website

A static marketing website. Plain HTML, CSS and vanilla JavaScript. No build step, no
npm, no framework. Open a file in any text editor, change it, upload it again.

**Total page weight is roughly 90–110 KB per page including fonts** — well inside the
500 KB target, and most of that is cached after the first page view.

---

## 1. Before you publish — fill in the placeholders

Everywhere real information was missing, the site contains a marked placeholder such as
`[[PHONE]]`. **Find and replace each one across every file** (most editors do this with
Find in Files / Replace in Folder — VS Code: `Ctrl+Shift+H`).

Work through this list top to bottom. Nothing else needs changing to go live.

| Placeholder | Put in | Appears in | Times |
|---|---|---|---|
| `[[DOMAIN]]` | Your domain, no `https://` and no trailing slash, e.g. `pukutrading.com` | every page, `sitemap.xml`, `robots.txt` | 72 |
| `[[EMAIL]]` | Enquiry inbox, e.g. `info@pukutrading.com` | every page, `assets/js/site.js` | 41 |
| `[[PHONE]]` | Phone in international format, e.g. `+264 81 234 5678` | every page | 40 |
| `[[WHATSAPP NUMBER]]` | WhatsApp number, **digits only, no `+`, no spaces**, e.g. `264812345678` | every page, `assets/js/site.js` | 18 |
| `[[WHATSAPP DISPLAY]]` | The same number written for humans, e.g. `081 234 5678` | `contact.html` | 1 |
| `[[FORMSPREE ID]]` | Your Formspree form ID (see section 3) | every page, `assets/js/site.js` | 8 |
| `[[TRUST REG NO]]` | Trust registration number as registered | footer of every page, `about.html`, `how-we-work.html`, `contact.html` | 12 |
| `[[TRUSTEE NAME]]` | Name of the trustee | `about.html` | 1 |
| `[[STREET ADDRESS]]` | Physical street address in Gobabis | `about.html`, `contact.html`, structured data | 10 |
| `[[POSTAL ADDRESS]]` | Postal address / P.O. Box | `contact.html` | 1 |
| `[[OPENING HOURS]]` | Human-readable hours, e.g. `Monday to Friday, 08:00–17:00` | `contact.html` | 1 |
| `[[OPENING TIME]]` | Opening time in 24-hour form for Google, e.g. `08:00` | structured data on every page | 8 |
| `[[CLOSING TIME]]` | Closing time in 24-hour form, e.g. `17:00` | structured data on every page | 8 |

To confirm you have caught them all, search the whole folder for `[[` — there should be
no results left.

### Also check these before publishing

Three things were written from general knowledge and are worth a glance:

1. **The distances on the home page and About page** — Windhoek `≈205 km` and Buitepos
   `≈110 km` from Gobabis. Correct them if your figures differ.
2. **"English or Afrikaans, whichever suits you"** on `contact.html` and
   `agriculture.html`. Remove it if that is not accurate.
3. **`agriculture.html` and `chemicals.html` list product categories generically.** No
   supplier, manufacturer or brand is named anywhere as a partner or principal. The one
   brand word on the site is "Chromadek" in `building-roofing.html`, used only to
   describe a coated-steel sheet type, phrased as "Chromadek and equivalent coated
   steel". Delete it if you would rather name no brand at all.

---

## 2. Deploy to Netlify by drag and drop

1. Go to <https://app.netlify.com/drop>.
2. Drag **the whole site folder** (the folder containing `index.html`) onto the page.
   Do not zip it, and do not drag the individual files — Netlify needs the folder so the
   paths stay correct.
3. Netlify publishes it in a few seconds and gives you a temporary address like
   `random-name-12345.netlify.app`. The site is live at that address immediately.
4. To update later: log in, open the site, go to **Deploys**, and drag the folder onto
   the deploy area again. Each drop replaces the whole site.

If you would rather create a free account first, do — it lets you keep the same URL, set
the custom domain, and see form activity.

### Any other host works too

There is nothing Netlify-specific in the site. It will run on Cloudflare Pages, GitHub
Pages, Vercel, or ordinary shared hosting via FTP. Just upload every file and folder,
keeping the structure intact. The one Netlify-only file is `_headers`, which sets cache
times; other hosts ignore it harmlessly.

---

## 3. Wire up the enquiry form (Formspree)

The form works without any JavaScript, so this is the only step that matters for
receiving enquiries.

1. Create a free account at <https://formspree.io>.
2. Create a new form and choose the e-mail address enquiries should arrive at.
3. Formspree gives you an endpoint like `https://formspree.io/f/xdorzabc`. The part after
   `/f/` — `xdorzabc` — is your form ID.
4. Replace `[[FORMSPREE ID]]` everywhere with that ID.
5. Submit the form once yourself. Formspree sends a confirmation e-mail the first time;
   click the link in it or nothing will come through.

**File uploads.** The form has an optional file field for a spec sheet or a photo, and
the form is already set up with `enctype="multipart/form-data"` so uploads work.
Formspree only accepts file uploads on their paid plans — on the free plan the enquiry
still arrives, the attachment is simply dropped. If you stay on the free plan, either
tell people to WhatsApp the photo, or delete the file field from each page (search for
`Spec sheet or photo`).

**If the form is ever down**, every page also carries a working `mailto:` link and the
WhatsApp link directly under the form, so nobody is left with no way to reach you.

**Changing the endpoint later:** it appears in two kinds of place — the `action="..."` on
each `<form class="enquiry-form">` in the eight HTML files, and `FORMSPREE_ENDPOINT` at
the top of `assets/js/site.js`. Update both. (If they ever disagree, the value in
`site.js` wins for visitors with JavaScript, and the one in the HTML wins for those
without.)

---

## 4. Changing the WhatsApp number or the pre-filled message

Open `assets/js/site.js`. Everything adjustable is in the `PUKU` block at the top:

```js
var PUKU = {
  FORMSPREE_ENDPOINT: "https://formspree.io/f/xdorzabc",
  WHATSAPP_NUMBER:    "264812345678",
  WHATSAPP_MESSAGE:   "Hi Puku Trading, I'd like a quote for ",
  EMAIL:              "info@pukutrading.com"
};
```

The number must be digits only, in full international format: Namibia is country code
`264` and you drop the leading zero, so `081 234 5678` becomes `264812345678`.

The floating WhatsApp button also picks up the page it was clicked from, so a visitor on
the chemicals page starts a chat reading *"Hi Puku Trading, I'd like a quote for
chemicals: "*. That comes from the `data-wa-subject` attribute on each page's `<body>`
tag if you want to change the wording.

Because the site must work with JavaScript disabled, the number is **also** written into
the `wa.me/...` links in the HTML — which is why `[[WHATSAPP NUMBER]]` has to be replaced
in the HTML files as well, not only here.

---

## 5. Pointing your domain at the site

1. Buy the domain wherever you like (`.com.na` and `.na` domains go through a Namibian
   registrar; `.com` from any international registrar).
2. In Netlify: **Site configuration → Domain management → Add a domain**, and enter it.
3. Netlify shows you what to set at your registrar. Usually either:
   - change the domain's **nameservers** to the Netlify ones it lists (simplest), or
   - add a `CNAME` record for `www` pointing at your `something.netlify.app` address, and
     an `A` record for the bare domain pointing at the IP Netlify gives you.
4. Wait for DNS to propagate — minutes to a few hours.
5. Netlify issues a free HTTPS certificate automatically once the domain resolves. Check
   that the padlock appears before you print the address on anything.
6. **Then** replace `[[DOMAIN]]` throughout the site with the real domain and redeploy,
   so the canonical tags, sitemap and social preview point at the right place.

---

## 6. What is in the folder

```
index.html              Home
chemicals.html          Industrial chemicals — the deepest page, includes the
                        chlorine strength verification service in full
building-roofing.html   Building & roofing materials
agriculture.html        Agricultural & farm supplies
how-we-work.html        The process, and how the agent model affects price
about.html              The trust, Gobabis, what an agent is
contact.html            Contact details, enquiry form, service area
404.html                Shown for a bad URL

sitemap.xml             Search engine sitemap — update the dates if you edit pages
robots.txt              Allows all crawlers, points at the sitemap
site.webmanifest        Icon and colour information for phones
favicon.ico             Browser tab icon
_headers                Netlify caching and security headers (ignored elsewhere)

assets/css/site.css     The entire stylesheet. Colours are at the top under :root
assets/js/site.js       Config block, mobile menu, form handling, one animation
assets/fonts/           Self-hosted subsetted fonts (53 KB total) + their licences
assets/img/og.png       Social sharing preview image (1200×630)
assets/img/icon*.png    App and tab icons
assets/img/icon.svg     Vector icon
```

### Editing a page

Every page is built from the same visible parts: a header, one or more sections, an
enquiry form, and a footer. If you copy a section from one page to another it will look
right, because all the styling comes from `assets/css/site.css`.

The enquiry form is deliberately duplicated in each HTML file rather than injected by
JavaScript, so that it still works if a script fails to load. **If you change the form,
change it in all eight files.**

### Changing the colours

At the top of `assets/css/site.css`:

```css
:root {
  --iodine:   #0e1a21;   /* near-black used for text and dark bands */
  --galv:     #4e5f67;   /* steel grey for labels and metadata      */
  --sheet:    #e8e6df;   /* page background                          */
  --chalk:    #fcfbf8;   /* panels and cards                         */
  --endpoint: #0f6c9c;   /* links and markers                        */
  --signal:   #b8390f;   /* the accent — used sparingly on purpose   */
}
```

Change a value here and it changes everywhere. If you replace `--signal` with something
lighter, check that white text on it is still readable.

---

## 7. Accuracy rules the site was written to

These constraints are baked into the copy. Keep to them when you edit:

- **No supplier, manufacturer or brand is named as a principal, partner or agency.**
  Sourcing is described generically: "established South African manufacturers".
- **No claim of stock, warehousing, a fleet or a team.** The site says "we source and
  deliver" and states plainly that Puku holds no stock.
- **No certifications or memberships** — no ISO, SABS or SANS claims anywhere.
- **No invented numbers**: no client counts, no years of experience, no testimonials, no
  statistics. The only figures on the site are the two road distances and `12.5 %`, which
  is a standard commercial hypochlorite strength used as an example, not a claim about
  any customer's product.
- **No prices and no delivery times.** Everything is "quoted per enquiry" and the timing
  section explains honestly why a fixed number of days cannot be promised.
- **The chlorine verification is described as a field titration, not a laboratory
  certificate**, and the page says so explicitly.

---

## 8. Search engines

After the domain is live:

1. Add the site to [Google Search Console](https://search.google.com/search-console) and
   submit `https://yourdomain/sitemap.xml`.
2. Create a **Google Business Profile** for Puku Trading Trust in Gobabis. For local
   searches like "chemical supplier Gobabis" this does more than anything on the website
   itself. Use exactly the same business name, address and phone number as the site.
3. The pages already carry LocalBusiness structured data with the address, service area
   and opening hours. It is filled from the placeholders above, so it is only correct
   once you have replaced them.

Page titles and descriptions target the terms the business actually wants: *industrial
chemicals Namibia*, *water treatment chemicals Namibia*, *chemical supplier Windhoek*,
*roofing sheets Gobabis*, *farm supplies Omaheke*. They live in the `<title>` and
`<meta name="description">` tags at the top of each file if you want to adjust them.

---

## 9. Accessibility and performance notes

Worth preserving if you edit:

- Every image and icon has alternative text or is marked decorative.
- Headings run in order — one `<h1>` per page, then `<h2>`, then `<h3>`.
- Keyboard focus is visible on every interactive element, and there is a "skip to
  content" link.
- Text contrast meets WCAG AA against its background.
- The single animation (the strength bar) is switched off automatically for anyone whose
  device asks for reduced motion.
- Fonts are self-hosted and subsetted, so no request goes to Google Fonts and nothing
  external can block the page from rendering.
- There are no third-party scripts, no tracker, no cookie banner, because there are no
  cookies. If you add analytics later, that changes — you will need a privacy note.
