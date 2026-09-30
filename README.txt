# WiFly Website

A mobile-first responsive static website for WiFly.

## Files
- `index.html` — main website
- `style.css` — responsive design and branding
- `script.js` — navigation, filters, animations and form interactions
- `assets/wifly-logo.jpg` — uploaded WiFly logo

## Important
The phone number, WhatsApp number, email and location in the website are placeholders.
Replace:
- `+94000000000`
- `info@wifly.lk`
- `Sri Lanka`

The contact form currently shows a confirmation toast. To receive real enquiries, connect it to a backend/form service later.

## Run
Open `index.html` in a browser, or upload the folder to a static hosting service.

## WhatsApp form
Open `script.js` and change `WHATSAPP_NUMBER` (top of the "Form -> WhatsApp" block)
to your real number in international format without "+" (e.g. 94771234567).
Also replace the wa.me links in `index.html`.

## Theme
Light/Dark toggle is in the header. The choice is saved in the browser (localStorage).

## WhatsApp number (one place)
Change `WHATSAPP_NUMBER` in `script.js`. It updates the form, the floating button,
the contact card and the mobile bottom bar automatically.
(Phone `tel:` links and the email are still edited in `index.html`.)

## Portfolio images
1. Put your image in `assets/portfolio/` (e.g. `assets/portfolio/website.jpg`, any size).
2. In `index.html`, add `data-image="assets/portfolio/website.jpg"` to that work card:
   <div class="work-card" data-category="it" data-image="assets/portfolio/website.jpg">
The card thumbnail and the lightbox will then show your real image.
