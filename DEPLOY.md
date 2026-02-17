# Deployment Guide for MedScan on Vercel

This guide will walk you through deploying your MedScan project to Vercel, which is the recommended platform for Next.js applications.

## Prerequisites

1.  **Vercel Account:** Create one at [vercel.com](https://vercel.com/signup).
2.  **GitHub Account:** Create one at [github.com](https://github.com/join).
3.  **Git Installed:** Ensure Git is installed on your machine.

## Step 1: Create a GitHub Repository

1.  Log in to GitHub.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name it `med-scan` (or similar).
4.  Make it **Public** or **Private** (Private is fine).
5.  Do **not** initialize with README, .gitignore, or license (we have these locally).
6.  Click **Create repository**.
7.  Copy the remote URL (e.g., `https://github.com/YourUsername/med-scan.git`).

## Step 2: Push Your Code to GitHub

Open your terminal in the project folder (`med-scan-main`) and run these commands:

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit for MedScan"

# Add the remote repository (replace URL with yours)
git remote add origin https://github.com/YourUsername/med-scan.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Connect your GitHub account if prompted.
4.  Find your `med-scan` repository in the list and click **Import**.

## Step 4: Configure Project

You will see a configuration screen.

1.  **Framework Preset:** Next.js (should be auto-detected).
2.  **Root Directory:** `./` (default).
3.  **Environment Variables:**
    *   Expand the **Environment Variables** section.
    *   Add: `GOOGLE_API_KEY` -> Paste your key from `.env`.
    *   Add: `DATABASE_URL` -> **IMPORTANT:** SQLite (`file:./dev.db`) does NOT work well on Vercel (data will be lost).
        *   **Recommendation:** Use Vercel Postgres or another cloud database.
        *   **For pure demo purposes (no persistence):** You can keep `file:./dev.db` but note that data resets on every deployment.
        *   **Better (Use Vercel Postgres):**
            1.  In Vercel Project Dashboard -> Storage -> Create Database (Postgres).
            2.  Follow instructions to add `POSTGRES_URL` etc. to Environment Variables.
            3.  Update `schema.prisma` to use `postgresql` provider.
            4.  Run migrations locally against the new URL.

4.  Click **Deploy**.

## Step 5: Post-Deployment

Vercel will build your project. Once done, you will get a live URL (e.g., `https://med-scan.vercel.app`).

### Updating the App
Code pushed to the `main` branch on GitHub will automatically trigger a new deployment on Vercel.
