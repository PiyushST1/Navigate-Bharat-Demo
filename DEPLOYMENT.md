# Deploying NaViGate Bharat demo to staging

This is a **static site**: no build step, no database, no server-side code, no environment variables.
Upload the **entire folder contents** to the web root (or any sub-folder) of a web server.

## Must-have files and folders (all of them)

```
index.html  analytics.html  categories.html  crs.html  psa.html  search.html  sla.html  video.html
assets/css/style.css
assets/js/app.js  assets/js/data.js
assets/media/sample.mp4
cms/            (login, dashboard, upload, library, approvals, crs-admin, psa-admin, users, audit, core-lib.js)
NaViGate_Design_Alternatives/   (viewer.html, 4 design pages, cms.html, login-demo.js, images/)
```

**Most common failure:** only the loose `.html` files were uploaded and the `assets/` and `cms/`
folders were left out (this happens with GitHub's "Add files via upload" and some FTP tools).
Every page loads `assets/css/style.css`, `assets/js/data.js` and `assets/js/app.js`; without them the
site shows unstyled or blank pages. Upload folders, not just files.

## Server requirements

- Any static host: Nginx, Apache, IIS, S3 + CloudFront, GitHub Pages, Netlify.
- Linux servers are **case-sensitive**. Keep file and folder names exactly as shipped
  (for example `NaViGate_Design_Alternatives`, `Concept-C_Cinematic-Gateway_Light.html`).
- MIME types: `.html` text/html, `.js` text/javascript, `.css` text/css, `.svg` image/svg+xml, `.mp4` video/mp4.
  If the host sends `X-Content-Type-Options: nosniff`, these must be correct or scripts/styles are blocked.
- A sub-path such as `https://staging.example.com/navigate/` works: all links are relative.
- Do not strip or rewrite `.html` extensions, and do not add a single-page-app fallback to `index.html`.
- Content-Security-Policy, if set: the pages use inline `<style>` and `<script>`, so allow `'unsafe-inline'`
  for `script-src` and `style-src` (or the pages will render blank). Fonts are system fonts; no CDN is used.
- Serve over http(s), not `file://` (Download buttons and video need http).

## Quick check after upload (all must return 200)

```
/index.html
/assets/css/style.css
/assets/js/app.js
/assets/js/data.js
/assets/media/sample.mp4
/cms/login.html
/NaViGate_Design_Alternatives/viewer.html
```

## Demo logins (sample data only, stored in the browser)

Portal CMS: `/cms/login.html`, password for all accounts `Demo@1234`.

| Role | Email |
|---|---|
| Super Admin | superadmin@demo.adg |
| Inputter | inputter@demo.adg |
| Approver | approver@demo.adg |

Design-alternatives CMS demo: `/NaViGate_Design_Alternatives/cms.html` (pick any account, any password).

## External links

Only outbound links (WhatsApp/Twitter share, ADG office websites). No external scripts, fonts or APIs are loaded,
so staging does not need outbound internet access.
