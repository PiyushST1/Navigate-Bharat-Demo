# NaViGate Bharat 2.0 - Demo Portal

Demonstration prototype by ADG Online Solutions Pvt. Ltd. for the NaViGate Bharat portal technical presentation.
All content (videos, names, figures) is fictional sample data. This is not the official portal.

## Run locally

No build step and no internet needed.

    python -m http.server 8080
    # open http://localhost:8080

You can also open `index.html` directly. Over `file://` the Download buttons only show a message; over http they download the file.

## What is inside

| Area | Pages |
|---|---|
| Public portal | `index.html`, `search.html`, `video.html`, `categories.html` |
| Community Radio and PSA | `crs.html`, `psa.html` |
| Operations | `analytics.html`, `sla.html` |
| CMS (RBAC) | `cms/login.html`, `dashboard`, `upload`, `library`, `approvals`, `crs-admin`, `psa-admin`, `users`, `audit` |

Shared code: `assets/css/style.css` (design system), `assets/js/data.js` (sample data), `assets/js/app.js` (shell, search, accessibility, charts), `cms/core-lib.js` (CMS helpers).

## CMS: role-based access (three roles, maker-checker)

Open `cms/login.html` (or "Staff login"). Demo password for all accounts: `Demo@1234`.

| Role | User | Email | Can | Cannot |
|---|---|---|---|---|
| Super Admin | Anita Rao | superadmin@demo.adg | Manage users, roles and passwords; edit any content details; unpublish and delete; full audit log; master-data edit and delete | Upload, submit, approve or publish |
| Inputter (maker) | Vikram Singh | inputter@demo.adg | Upload and create content; edit own drafts and returned items; submit for approval; create and edit stations and PSA films | Approve, publish, delete, promote, manage users |
| Approver (checker) | Meera Joshi | approver@demo.adg | Approve or return; publish and unpublish; promote staging to live; decide awards and PSA films; read the audit log | Upload or edit content, manage users |

The full permission matrix is on the User management page (Super Admin). Permissions are defined once in `assets/js/app.js` (`PERMS`) and enforced in every page handler. Every state change is written to the audit log.

State (uploads, approvals, users, incidents) is kept in browser localStorage.
