# Puku Trading Trust — website

Five pages of plain HTML, one stylesheet, one small script. No framework, no npm, no
build step. Open a file in a text editor, change it, push it.

About **68 KB per page** including the fonts and the logo, against a 500 KB target.

```
index.html              Home — what Puku does, the four divisions, how it works,
                        the agent model, enquiry form
chemicals.html          Industrial chemicals, by application, plus the chlorine
                        strength verification service
building-roofing.html   Roofing and building materials
agriculture.html        Farm and livestock supplies
contact.html            Enquiry form and contact details
404.html                Shown for a bad URL (not part of the five pages, but the
                        host needs it)
```

---

## 1. Placeholders — three things to fill in

Everything else on the site is real. Find and replace these across the whole folder
(VS Code: `Ctrl+Shift+H`):

| Placeholder | Replace with | Where | Times |
|---|---|---|---|
| `[[DOMAIN]]` | Your domain, no `https://`, no trailing slash — e.g. `pukutrading.com` | every page, `sitemap.xml`, `robots.txt` | 48 |
| `[[FORMSPREE ID]]` | Your Formspree form ID — see section 3 | `index.html`, `contact.html`, `assets/js/site.js` | 3 |
| `[[OPENING HOURS]]` | e.g. `Monday to Friday, 08:00–17:00` | `contact.html` | 1 |

Search the folder for `[[` afterwards — there should be nothing left.

### Details already in the site

These are used throughout and are correct as written. If any changes, search and replace
it the same way:

- **Puku Trading Trust**, Trust **T 65/2018** (footer only, small)
- **91 Nelson Mandela Avenue, Windhoek, Namibia**
- **+264 81 254 5797** — WhatsApp and phone. In links it appears as `264812545797`
  (WhatsApp, digits only) and `+264812545797` (`tel:`)
- **pukutrading@gmail.com**

### The logo

The master artwork lives in `assets/img/source/` and is deliberately not published —
`.assetsignore` keeps that folder out of the deployed site. Everything the site uses is
derived from it:

```
assets/img/source/puku-logo.png   master file, transparent background
assets/img/puku-logo.png          header wordmark, navy, trimmed, 236px wide
assets/img/puku-logo-light.png    footer wordmark, white, same artwork
assets/img/apple-touch-icon.png   the logo's own P, white on navy
assets/img/icon-192.png           same, for Android
assets/img/icon-512.png           same, larger
favicon.ico                       same, at 16/32/48px
assets/img/og.png                 social preview, built from the wordmark
```

The wordmarks are twice the size they display at, so they stay sharp on phone screens.
Display width is set in CSS (`.mark img`), not in the HTML.

**If the logo ever changes**, replace `assets/img/source/puku-logo.png` and regenerate the
rest — or just re-cut the files above by hand at the same sizes.

**The navy is a single CSS variable.** `--navy` in `assets/css/site.css` is `#092c4d`,
sampled from the logo file itself. Headings, the footer, buttons and links all derive from
it, so changing that one line recolours the site.

---

## 2. Deploying

The site is on **Cloudflare**, built from this GitHub repository. Push to `main` and it
redeploys itself within a minute or two. Watch it under **Workers & Pages → pukutrading →
Deployments**.

`wrangler.jsonc` tells Cloudflare what to publish — the whole folder, no server-side
code, and `404.html` for unknown URLs. Do not delete it; the deployment fails without it.
`.assetsignore` keeps the git plumbing and this README out of the published output.

**The first build only starts on the next push.** When a repository is first connected,
Cloudflare says "You can now push a commit to your Git repository to start your first
build" and then waits — it does not build the commit already at the top of `main`. Push
anything, however small, and it runs.

If you ever need to deploy without git: **Workers & Pages → Create → Pages → Upload
assets**, and drag the folder in.

---

## 3. The enquiry form (Formspree)

There is a form on the Home page and on Contact. Both work without JavaScript; with it,
they submit in the background so the visitor stays on the page.

1. Create a free account at <https://formspree.io>.
2. Create a form pointed at the address enquiries should reach.
3. Formspree gives you an endpoint like `https://formspree.io/f/xdorzabc`. The part after
   `/f/` is your form ID.
4. Replace `[[FORMSPREE ID]]` with it — in the two HTML files and in `assets/js/site.js`.
5. Submit the form once yourself. Formspree sends a confirmation e-mail the first time;
   until you click it, nothing comes through.

**File uploads.** The optional attachment field works, but Formspree only accepts uploads
on their paid plans. On the free plan the enquiry still arrives and the attachment is
dropped — so either tell people to send photographs on WhatsApp, or remove the field
(search for `Specification or photo`).

If the form ever fails, every page still carries the WhatsApp and `mailto:` links
directly beneath it.

---

## 4. WhatsApp

`assets/js/site.js` starts with the config block:

```js
var PUKU = {
  FORMSPREE_ENDPOINT: "https://formspree.io/f/xdorzabc",
  WHATSAPP_NUMBER:    "264812545797",
  WHATSAPP_MESSAGE:   "Hi Puku Trading, I'd like a quote for ",
  EMAIL:              "pukutrading@gmail.com"
};
```

The number is digits only, full international format — Namibia is `264` and the leading
zero drops, so `081 254 5797` becomes `264812545797`.

The floating button picks up which page it was clicked from, so someone on the chemicals
page opens WhatsApp with *"Hi Puku Trading, I'd like a quote for chemicals: "* already
typed. That comes from `data-subject` on each page's `<body>` tag.

Because the site must work with JavaScript off, the number is **also** written into the
`wa.me/` links in the HTML. Change it in both places.

---

## 5. Pointing the domain (registered at Porkbun) at Cloudflare

The domain stays registered at Porkbun — only DNS moves.

1. **Cloudflare → Add a domain** → your domain → Free plan. It imports the existing DNS;
   check the list, especially any `MX` records, or e-mail on the domain stops when the
   nameservers change. Cloudflare gives you two nameservers.
2. **Turn DNSSEC off at Porkbun first.** Changing nameservers with a DNSSEC record on file
   takes the domain offline entirely and gives you no useful error.
3. **Porkbun → Domain Management → your domain → Authoritative Nameservers → Edit.**
   Replace Porkbun's with Cloudflare's two.
4. Wait for Cloudflare to report the domain active — usually minutes.
5. **Workers & Pages → pukutrading → Domains → Add Domain** → `pukutrading.com`, then
   `www.pukutrading.com`. Cloudflare creates the records and the certificate itself.
6. Then replace `[[DOMAIN]]` in the files and push.

The `*.workers.dev` address keeps working throughout, so you always have a link to send.

---

## 6. Editing

**Colours** live at the top of `assets/css/site.css`:

```css
:root {
  --navy:    #092c4d;   /* sampled from the logo — everything builds on this */
  --text:    #1e2733;   /* body text                                   */
  --muted:   #5c6675;   /* secondary text                              */
  --line:    #e2e6ec;   /* hairlines                                   */
  --surface: #f6f7f9;   /* tinted section backgrounds                  */
  --accent:  #a85a0e;   /* the only accent — used on one thing         */
}
```

Change a value here and it changes everywhere. If you replace `--accent`, check that
white text still reads on it.

**The form is duplicated** in `index.html` and `contact.html` rather than injected by
JavaScript, so that it still works if a script fails. Change one, change the other.

**Adding a section**: copy an existing `<section class="section">` block. The home page is
deliberately five sections and no more — if you add a sixth, consider what comes off.

---

## 7. What the site does not say

The copy was written to these constraints. Keep them if you edit:

- No supplier, manufacturer or brand is named as a principal or partner.
- No claim of stock, warehousing, a fleet, staff or years of experience.
- No certifications — none are held.
- No invented statistics, client counts or testimonials.
- No prices and no delivery times.
- The chlorine verification is described as a field titration and explicitly not as a
  laboratory certificate.

The only figures on the site are the bars in the verification section, captioned as an
illustration rather than a measurement.

---

## 8. Search engines

Once the domain is live:

1. Add the site to [Google Search Console](https://search.google.com/search-console) and
   submit `https://yourdomain/sitemap.xml`.
2. Create a **Google Business Profile** for Puku Trading Trust at the Windhoek address.
   For "chemical supplier Windhoek" this matters more than anything on the site itself.
   Use exactly the same name, address and number as the site.
3. LocalBusiness structured data is already on every page, using the real address. It only
   becomes correct once `[[DOMAIN]]` is replaced.

Titles and descriptions target *industrial chemicals Namibia*, *chemical supplier
Windhoek*, *roofing sheets Namibia*, *water treatment chemicals Namibia*. They are in the
`<title>` and `<meta name="description">` at the top of each file.

---

## 9. Accessibility and performance

- One `<h1>` per page, headings in order, no skipped levels.
- Every form field has a label; keyboard focus is visible; there is a skip link.
- All text meets WCAG AA contrast against its background.
- One animation on the whole site — the shortfall bar in the verification section — and it
  is switched off for anyone whose device asks for reduced motion.
- Fonts are self-hosted and subsetted (24 KB), so nothing is requested from Google Fonts
  and no external request can block rendering.
- No third-party scripts, no analytics, no cookies, so no cookie banner is needed. Adding
  analytics later changes that.
