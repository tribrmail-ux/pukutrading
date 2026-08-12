# Puku Trading Trust — website

Five pages of plain HTML, one stylesheet, one small script. No framework, no npm, no
build step. Open a file in a text editor, change it, push it — Cloudflare redeploys.

About **77 KB per page** on a first visit, ~40 KB after that once the fonts are cached,
against a 500 KB target. Zero external requests: no Google Fonts, no CDN, no tracker.

```
index.html              Home — hero, three areas of supply, how it works, about, enquiry
chemicals.html          Industrial chemicals, by application area
building-roofing.html   Roofing & sheeting, and layout/quantity assistance
sourcing.html           Specialised industrial sourcing
contact.html            Enquiry form and contact details
404.html                Shown for a bad URL
```

Everything on the site is real. There are no placeholders left to fill in.

---

## 1. How the design works

Read this before editing anything visual. The whole system is four ideas, and they only
work together.

### Bands

Every page is a stack of **full-bleed bands**. A band is white, tint (`.band--tint`), or
navy (`.band--navy`). A band sets its own colour tokens, so everything inside it — text,
rules, labels, focus rings, the accent — inverts automatically on navy. There are no
"dark mode" overrides anywhere in the stylesheet; there is nothing to keep in sync.

The home page runs **navy → tint → white → navy → white → navy**. Dark top, dark keel,
dark tail. That silhouette is what makes the site recognisable at thumbnail size, which
matters because there is no photography and no icon set.

Every page opens with a navy band, and the header sits *inside* it. That is why the
wordmark needs only one colour treatment on the whole site.

### The rule grammar

Four line weights, four meanings. This is the site's entire ornament:

| Token | Weight | Means |
|---|---|---|
| `--rule-group` | 3px navy | **a group starts here** — the three division plates and the roofing feature block, nowhere else |
| `--rule-section` | 2px navy | a top-level section starts here |
| `--rule-struct` | 1px navy | structure inside a section — the step tops |
| `--rule-hair` | 1px grey | between peers — table rows, form separators, footer columns |

If you add a border that isn't one of these four, the page gets busier and the
divisions stop reading as separate groups. That is precisely the failure this design was
rebuilt to fix.

### The three divisions

The grouping is carried by **three independent cues**, and two of them survive any colour
failure:

1. **A 3px navy rule** across the top of every plate. This is the mechanism. Never remove it.
2. **Asymmetric padding** — 20px above, 32px below, 14px heading-to-text. The largest gap
   inside a plate is a fraction of the gap between plates, so proximity alone groups them.
3. **A white plate on the tint ground.** Reinforcement only. It is a 1.17:1 difference and
   will wash out on a cheap phone in daylight, which is where this site is actually read.

The review gate: screenshot the divisions at 320px wide and convert to greyscale. If the
plates do not read as separate groups, something has been broken. The fix is
never to darken the tint.

### Type

Two families, three files. **Instrument Sans** 400 and 700 sets everything that is a
sentence. **Geist Mono** sets labels only — eyebrows, key strips, nav, form hints, step
numerals — never a sentence, never above `--fs-label`, always uppercase. The moment mono
sets a paragraph or a button, the page reads as a retro terminal instead of a supplier.

There is no 600 weight in the repo. Do not specify one: CSS would resolve it up to 700 and
the tier you intended would silently vanish.

### And three absolutes

**No border-radius, anywhere.** **No box-shadow, anywhere.** **Nothing is centred, ever** —
every left edge on the site lands on the same vertical line.

---

## 2. Colours

All of it is in `:root` at the top of `assets/css/site.css`. One hue family: navy 209°,
neutrals 209–216°, accent 186–192°. There is deliberately **no warm colour** in the system.

```css
--navy:        #092c4d   /* from the logo — everything is built on it */
--tint:        #eaeef3   /* the one light alternate ground */
--slate:       #33455c   /* prose on light */
--slate-2:     #46586d   /* secondary text and labels on light */
--on-navy:     #b9c9d9   /* secondary text on navy */
--line-strong: #77879a   /* form borders */
--teal:        #06636b   /* accent on light — 6.99:1 */
--cyan:        #5ec4de   /* accent on navy — 7.05:1 */
```

Verified contrast: navy on white 14.20:1, slate 9.78:1, slate-2 7.30:1, teal 6.99:1; on
the tint ground navy 12.19:1, slate 8.40:1, teal 6.00:1; on navy, white 14.20:1 and
on-navy 8.40:1.

**Never write a colour literal in a rule** — always `var(--accent)` and so on. A literal
can reach the wrong ground and produce an unreadable pair. There is one accent hue at two
lightnesses and the band swaps them for you.

---

## 3. The logo

The master artwork is `assets/img/source/puku-logo.png`, kept in the repo and excluded
from the published site by `.assetsignore`.

`assets/img/puku-logo.svg` is that artwork **traced to vector** — one path, `currentColor`,
so it is sharp at any size and the same file serves the white header mark and the white
footer mark. The path is inlined into each page as a hidden `<symbol id="puku">` and used
twice per page via `<use href="#puku">`.

There are no PNG versions of the wordmark in the layout, deliberately: a raster at header
size upscales on a phone and looks soft and pasted-on, which was the original complaint.

To regenerate after a logo change, replace the master and re-trace it, or hand-edit the
`viewBox="8 8 1608 444"` path in `puku-logo.svg` — the aspect ratio 1608:444 is exactly
402:111 and should not be re-cropped.

---

## 4. Deploying

The site is on **Cloudflare**, built from this GitHub repository. Push to `main` and it
redeploys within a minute or two. Watch it under **Workers & Pages → pukutrading →
Deployments**.

`wrangler.jsonc` tells Cloudflare what to publish. Do not delete it; the deploy fails
without it. `.assetsignore` keeps the git plumbing, this README and the logo master out of
the published output.

**If you change the CSS, the JS or an image, bump the version token.** Every asset URL
carries `?v=` — currently `5`. Change it in all six HTML files (search for `?v=`). Without
it, a visitor can be served new HTML against a cached old stylesheet, which renders the
page as a broken hybrid. This has happened once already and it is not obvious when it does.

**The first build after connecting a repository only starts on the next push.** Cloudflare
says "You can now push a commit to your Git repository to start your first build" and then
waits — it does not build what is already at the top of `main`.

---

## 5. The enquiry form

There is a form on the home page and on Contact, with identical markup. Both post to
Formspree (`mwleowok`) and both work with JavaScript disabled; the script only adds
inline validation messages and swaps in the success block without leaving the page.

The form ID appears in three places: the `action` on each of the two forms, and
`FORMSPREE_ENDPOINT` in `assets/js/site.js`. Change all three together.

**Still to do once:** submit the form yourself. Formspree e-mails a confirmation the first
time a form is used and nothing is delivered until that link is clicked.

Free plan: 50 submissions a month, and file uploads are not included — the enquiry still
arrives, the attachment is dropped. Most Namibian buyers will send photographs on WhatsApp
anyway.

---

## 6. WhatsApp

`assets/js/site.js` opens with the config block:

```js
var PUKU = {
  FORMSPREE_ENDPOINT: "https://formspree.io/f/mwleowok",
  WHATSAPP_NUMBER:    "264812545797",
  WHATSAPP_MESSAGE:   "Hi Puku Trading, I'd like a quote for ",
  EMAIL:              "pukutrading@gmail.com"
};
```

Digits only, full international format — Namibia is `264` and the leading zero drops.
The number is **also** written into the `wa.me/` links in the HTML so the site works
without JavaScript; change it in both places.

On phones there is a fixed bar at the bottom of every page with **WhatsApp** and **Call**.
It replaced the floating round button.

---

## 7. Pointing the domain at Cloudflare

`pukutrading.com` is registered at Porkbun. Only DNS moves; the registration stays there.

1. **Cloudflare → Add a domain** → `pukutrading.com` → Free plan. Check the imported
   records, especially any `MX`, or e-mail on the domain stops when the nameservers change.
   Cloudflare gives you two nameservers.
2. **Turn DNSSEC off at Porkbun first.** Switching nameservers with a DNSSEC record on file
   takes the domain offline entirely and the error tells you nothing.
3. **Porkbun → Domain Management → pukutrading.com → Authoritative Nameservers → Edit** →
   replace with Cloudflare's two.
4. When Cloudflare reports the domain active: **Workers & Pages → pukutrading → Domains →
   Add Domain** → `pukutrading.com`, then `www.pukutrading.com`.

The site already uses `pukutrading.com` in its canonical tags, sitemap and preview URLs, so
nothing needs changing once it resolves. The `*.workers.dev` address keeps working
throughout.

---

## 8. Search engines

1. Add the site to [Google Search Console](https://search.google.com/search-console) and
   submit `https://pukutrading.com/sitemap.xml`.
2. Create a **Google Business Profile** at the Windhoek address. For "chemical supplier
   Windhoek" this does more than anything on the site itself. Use exactly the same name,
   address and number.
3. LocalBusiness structured data with the real address and opening hours is already on
   every page.

Titles and descriptions target *industrial chemicals Namibia*, *chemical supplier
Windhoek*, *roofing sheets Namibia*, *water treatment chemicals Namibia*.

---

## 9. What the site does not say

The copy was written to these limits. Keep them:

- No supplier, manufacturer or brand named as a principal or partner.
- No claim of stock, warehousing, a fleet, staff or years of experience.
- No certifications — none are held.
- No invented statistics, client counts or testimonials.
- No prices and no delivery times.
- **Puku does not test, formulate, engineer, certify, manufacture or warehouse.** Product
  suitability, specifications and safety documentation come from the manufacturer. The
  site says "source", "obtain", "coordinate" and "remain your point of contact" — never
  "specify", "design" or "test".
- **No agriculture, livestock or feed advice.** Agriculture was removed as a division; an
  agricultural product enquiry is handled under Specialised sourcing like any other.

---

## 10. Accessibility and motion

- One `<h1>` per page, headings in order, every form field labelled, visible focus on
  everything, a skip link.
- All text meets WCAG AA against its background; form borders clear the 3:1 non-text
  minimum against both neighbours.
- **Nothing on the site animates.** No scroll effects, no card reveals, no hover lifts.
  The only transitions are 120ms colour changes on interactive states.
- Fonts are self-hosted and subsetted, so nothing external can block rendering.
- No cookies, so no cookie banner. Adding analytics later would change that.
