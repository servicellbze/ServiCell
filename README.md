# Servicell
Servicell's Official Website.

## Editing the site

The site is plain static HTML served by GitHub Pages; there is no build step.

### Shared navigation and footer
The nav bar and footer are written once in `partials/nav.html` and `partials/footer.html`
and copied into every page between `<!-- partial:nav -->` / `<!-- partial:footer -->` markers.
After editing a partial, run this from the repo root and commit the updated pages:

```bash
python3 tools/sync-partials.py
```

New pages need the two pairs of markers (copy them from any existing page). Service pages
must also be added to `SERVICE_PAGES` in the script so the "Services" nav link is highlighted.

### Site settings
`js/site.js` starts with `SERVICELL_CONFIG`: the GoatCounter analytics code and the Google
reviews link. Analytics stays off until a code is set.

### Files
- `css/site.css` – shared buttons, footer, FAQ, open-now badge, mobile WhatsApp button
- `css/service.css` – layout for the service pages (`*-repair.html`, `battery-replacement.html`, `carrier-unlocking.html`)
- `css/nav.css`, `css/dark-mode.css`, `css/dark-mode.js` – nav bar and light/dark theme
- `img/` – optimised WebP images and the social share image (`og-image.jpg`)
- `sitemap.xml` – update when adding or removing pages
