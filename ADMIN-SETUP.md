# WiFly Admin Panel - Setup Guide

Admin URL (after setup): `https://YOUR-SITE.netlify.app/admin/`

How it works: staff log in at `/admin`, add a photo + title + category, press Publish.
The change is saved to your GitHub repo, Netlify sees it and updates the live site in about 1 minute.
No code needed after the one-time setup.

## One-time setup (about 20 minutes)

### 1. Put the site on GitHub
1. Create a free account at github.com and a new repository (e.g. `wifly-website`).
2. Upload ALL files from this folder (index.html, style.css, script.js, `assets/`, `data/`, `admin/`).

### 2. Edit `admin/config.yml`
Change these lines, then commit:
- `repo:` -> `your-username/wifly-website`
- `branch:` -> `main` (or your default branch)
- `site_url` and `display_url` -> your live website URL

### 3. Host on Netlify (recommended)
1. netlify.com -> Add new site -> Import from GitHub -> choose your repo.
2. Build command: leave empty. Publish directory: leave empty (or `.`). Deploy.

### 4. Create a GitHub OAuth App (allows login)
1. GitHub -> Settings -> Developer settings -> OAuth Apps -> New OAuth App.
2. Homepage URL: your Netlify site URL.
3. Authorization callback URL: `https://api.netlify.com/auth/done`
4. Register, then generate a Client Secret. Keep the Client ID and Secret.

### 5. Give Netlify the keys
Netlify -> your site -> Site configuration -> Access & security -> OAuth -> Install provider -> GitHub.
Paste the Client ID and Client Secret. (Menu names may differ a little; look for "OAuth".)

### 6. Log in
Open `https://YOUR-SITE.netlify.app/admin/` -> Login with GitHub.

## Adding staff
Each person who uses the admin needs a GitHub account and must be added as a collaborator
with Write access: repo -> Settings -> Collaborators -> Add people.

## Adding a photo (daily use)
1. Open `/admin` -> Portfolio -> Portfolio Works.
2. Click "Add works +" -> fill Title, Category, upload Photo.
3. Click Publish -> Publish now. Wait about 1 minute, refresh the website.
Photo size: any size or shape works, phone photos are fine (keep each under about 10MB).
- On Netlify the site resizes photos automatically (Netlify Image CDN), so pages stay fast.
- Cards crop to a landscape shape; the full photo is shown when clicked.
- On GitHub Pages there is no automatic resizing, so very large photos will load slowly. Compress them first at squoosh.app.
Drag items to reorder.

## Using GitHub Pages instead of Netlify
GitHub does not provide the login step, so you need a small free OAuth proxy
(for example a Cloudflare Worker such as `sveltia-cms-auth` or `decap-proxy`).
Then uncomment `base_url:` in `admin/config.yml` and set your proxy URL,
and set the OAuth App callback URL to the proxy's callback URL.

## If something does not work
- Login loops or "not found": check the repo name in config.yml and the OAuth callback URL.
- Photo does not show: wait for the Netlify deploy to finish, then hard refresh (Ctrl+Shift+R).
- The public site still works without the admin: if `data/portfolio.json` cannot load,
  the sample cards written in `index.html` are shown.
