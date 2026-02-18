# Deploying MedScan to Vercel (Production Ready)

I have already updated your project configuration (`package.json`, `prisma/schema.prisma`) to be compatible with Vercel.

## Step 1: Push to GitHub
If you haven't already, push your code to a GitHub repository:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Step 2: Create a Vercel Project
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2.  Import your `med-scan` repository from GitHub.
3.  **Use Default Settings** for Framework Preset (Next.js).

## Step 3: Set Environment Variables on Vercel
In the "Environment Variables" section of the deployment screen (or later in Settings -> Environment Variables), add:

1.  **GOOGLE_API_KEY**:
    - Value: `AIzaSyBe7ts5tdVt0SiTaJh2xPs7UUoAiopNC4Y` (or grab a fresh one from Google AI Studio).

2.  **DATABASE_URL**:
    - You need a PostgreSQL database.
    - **Option A (Recommended): Vercel Postgres**
        - In your Vercel Project Dashboard, go to **Storage** tab.
        - Click **Create Database** -> **Postgres**.
        - Follow the prompts.
        - Once created, go to the `.env.local` tab in the Storage view, copy the `POSTGRES_PRISMA_URL` (or just connection string).
        - Go back to **Settings -> Environment Variables** and add a new variable named `DATABASE_URL` with that value.
    - **Option B: Neon / Supabase**
        - Create a database on Neon.tech or Supabase.com.
        - Copy the Connection String.
        - Add it as `DATABASE_URL` in Vercel.

## Step 4: Deploy
Click **Deploy**.
- Vercel will install dependencies.
- It will run `prisma generate` (thanks to the script I added).
- It will build the Next.js app.

## Step 5: Sync Database Schema
After your database is created and connected, you need to push your schema (create tables) to the new production database.

**Run this locally in your terminal:**
1.  Get your production connection string (from Vercel Storage or Neon).
2.  Run:
```bash
# Replace the URL below with your actual production connection string
npx prisma db push --db-url "postgres://..."
```
*Note: This creates the tables in your production DB.*

## Troubleshooting
- **Build Fails?** Check the logs. If it complains about `next` version, try changing `"next": "16.1.6"` in `package.json` to `"next": "latest"` or `"next": "14.2.3"`.
- **Database Error?** Ensure `DATABASE_URL` is set correctly in Vercel Environment Variables.
