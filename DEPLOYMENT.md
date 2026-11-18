# GitHub Pages Deployment & Publishing Guide

This guide details the complete deployment setup for the **Digital Learning Hub** on GitHub Pages, including the automated GitHub Actions workflow, initial repository connection, future publishing procedures, and custom domain migration.

---

## 1. Project & Hosting Details

- **GitHub Account**: `vksinglakkr`
- **Repository Name**: `digital-learning-hub`
- **Planned GitHub Pages URL**: `https://vksinglakkr.github.io/digital-learning-hub/`
- **Future Custom Domain**: `learn.vksingla.in`
- **Deployment Mechanism**: Official GitHub Actions (`.github/workflows/deploy.yml`)

---

## 2. Architecture & How Publishing Works

- **Public Site**: Fast, client-rendered Single-Page Application (SPA) built with React 19, TypeScript, and Vite.
- **Data Source**: Public visitors fetch verified educational content exclusively from `data/curriculum.json`.
- **Admin Studio (`/admin`)**: Client-side content authoring studio. Working drafts and imports are saved in the author's browser `localStorage`.
- **Publishing Boundary**: Changes in Admin Studio do **not** affect live visitors until:
  1. You click **"Export for Publishing"** in Admin Studio to generate the validated `curriculum.json`.
  2. You replace `public/data/curriculum.json` with this file.
  3. You push the commit to `main`. GitHub Actions automatically rebuilds and deploys the update.
- **SPA Deep Linking**: A custom `404.html` and header decoder script in `index.html` ensure direct navigation and browser refreshes work flawlessly across all routes (e.g. `/category/:slug`, `/category/:categorySlug/topic/:topicSlug`, `/search`).

---

## 3. GitHub Actions Workflow Configuration

The deployment workflow is defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

- **Trigger**: Automatic on `git push` to `main`, plus manual trigger via `workflow_dispatch`.
- **Environment**: Node.js 22 (Active LTS), running on `ubuntu-latest`.
- **Steps**:
  1. Checkout source code (`actions/checkout@v4`).
  2. Install clean dependencies (`npm ci`).
  3. Validate code quality (`npm run lint`).
  4. Build production static bundle (`npm run build`) with `VITE_BASE_PATH: /digital-learning-hub/`.
  5. Upload `./dist` artifact (`actions/upload-pages-artifact@v3`).
  6. Deploy to GitHub Pages (`actions/deploy-pages@v4`).
- **Security & Permissions**: Minimal permissions (`contents: read`, `pages: write`, `id-token: write`).
- **Concurrency**: Grouped by `'pages'` with `cancel-in-progress: false` to prevent race conditions.

---

## 4. Initial Setup & First Deployment (Step-by-Step)

When you are ready to publish, follow these exact manual steps:

### Step 4.1: Create the GitHub Repository
1. Log into your GitHub account: **`vksinglakkr`**.
2. Navigate to [github.com/new](https://github.com/new).
3. Set **Repository name**: `digital-learning-hub`.
4. Choose **Public**.
5. **IMPORTANT**: Leave *"Add a README file"*, *"Add .gitignore"*, and *"Choose a license"* **UNCHECKED** (the local project already has all necessary files).
6. Click **Create repository**.

### Step 4.2: Connect Local Project and Push
Open your preferred terminal (PowerShell, Command Prompt, or Git Bash) in `C:\Users\HP\Documents\Digital-Learning-Hub`:

```bash
# 1. Initialize local Git repository (if not already initialized)
git init -b main

# 2. Add all prepared project files
git add .

# 3. Create the initial commit
git commit -m "feat: Initial commit with GitHub Actions deployment workflow"

# 4. Link to your new GitHub repository
git remote add origin https://github.com/vksinglakkr/digital-learning-hub.git

# 5. Push to GitHub
git push -u origin main
```

### Step 4.3: Enable GitHub Pages in Repository Settings
1. In your GitHub repository, click **Settings** (top menu).
2. On the left sidebar, click **Pages** (under "Code and automation").
3. Under **Build and deployment > Source**, select:
   👉 **GitHub Actions**
4. Save the setting.

### Step 4.4: Verify First Deployment
1. Click the **Actions** tab in your repository.
2. You will see the **"Deploy Digital Learning Hub to GitHub Pages"** workflow running.
3. Once completed (green checkmark), open:
   👉 **`https://vksinglakkr.github.io/digital-learning-hub/`**
4. Verify the homepage, categories, resources, and search function properly.

---

## 5. Ongoing Publishing Workflow

Whenever you add or update educational content in Admin Studio:

1. **Author in Admin Studio**:
   - Open `/admin` in your browser.
   - Add new resources, edit titles, set YouTube clip timestamps, or run GitHub folder imports.
2. **Export for Publishing**:
   - Click the green **"Export for Publishing"** button.
   - Review the summary modal and click **"Confirm & Download curriculum.json"**.
3. **Replace Project File**:
   - Place the downloaded `curriculum.json` into:
     ```
     public/data/curriculum.json
     ```
4. **(Optional) Local Sanity Check**:
   ```bash
   npm run build
   npm run preview
   ```
5. **Commit and Push**:
   ```bash
   git add public/data/curriculum.json
   git commit -m "publish: update curriculum content"
   git push origin main
   ```
   GitHub Actions will detect the change, rebuild the site, and update the live website within 1–2 minutes!

---

## 6. Post-Publishing Verification Checklist

After every deployment, run through this quick checklist on the live site:

- [ ] **Homepage**: Categories and resources display correctly.
- [ ] **Direct Category Link**: Access `https://vksinglakkr.github.io/digital-learning-hub/category/power-bi` directly (no 404).
- [ ] **Direct Topic Link**: Access an inner topic link directly.
- [ ] **Browser Refresh (F5)**: Refresh an inner page; confirm it stays on the page without redirecting to root or 404.
- [ ] **Global Search**: Type a search query (e.g. `multiplication`) and confirm results populate.
- [ ] **Interactive Previews**:
  - YouTube video plays with correct clip start/end timestamps.
  - Infographic preview opens in modal.
  - PDF references open cleanly.
- [ ] **Mobile Responsiveness**: Navigation menu and cards display properly on smaller screens.

---

## 7. Rollback Procedures

If an issue or malformed resource is published by mistake:

### Option A: Instant Git Rollback
```bash
git revert HEAD
git push origin main
```
GitHub Actions will immediately re-deploy the previous working build.

### Option B: Restore from Admin Studio JSON Backup
1. In Admin Studio (`/admin`), click **"Restore Backup"**.
2. Select your previous known-good backup file.
3. Click **"Export for Publishing"**, replace `public/data/curriculum.json`.
4. Commit and push:
   ```bash
   git add public/data/curriculum.json
   git commit -m "fix: rollback to previous verified curriculum"
   git push origin main
   ```

---

## 8. Future Migration to Custom Domain (`learn.vksingla.in`)

When you are ready to bind your custom domain `learn.vksingla.in`:

### Step 8.1: DNS Configuration
Add a CNAME record at your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap):
- **Type**: `CNAME`
- **Name / Host**: `learn`
- **Target / Value**: `vksinglakkr.github.io`

### Step 8.2: Update Workflow Base Path
Because custom domains host from the domain root (`/`) rather than a subpath (`/digital-learning-hub/`):

In `.github/workflows/deploy.yml`, change line 43:
```yaml
# Before (Subpath hosting):
VITE_BASE_PATH: /digital-learning-hub/

# After (Custom domain hosting):
VITE_BASE_PATH: /
```

### Step 8.3: Configure GitHub Pages Custom Domain
1. In repository **Settings > Pages**, enter `learn.vksingla.in` in **Custom domain**.
2. Check **Enforce HTTPS** once the SSL certificate finishes provisioning.
3. Commit and push the workflow change.
4. Your site will now be live at **`https://learn.vksingla.in/`**!
