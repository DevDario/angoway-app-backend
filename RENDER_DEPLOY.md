Quick steps to deploy this NestJS + Prisma app to Render

1) Create a Render account and connect your GitHub/Git repo.

2) In Render, create a new "Web Service" and choose "Docker" and point to your repository.
   - Name: angoway-app-backend
   - Branch: main
   - Dockerfile Path: Dockerfile
   - Instance Type / Plan: choose based on needs (Free/Starter)

3) Environment variables (required) — set them in Render Dashboard > Environment > Environment Variables:
   - DATABASE_URL: your Postgres connection string (e.g. postgres://user:pass@host:5432/dbname)
   - SECRET: your JWT secret (e.g. PedroCapitangoZamba)

4) Build & Start
   - Render will run the Docker build using the Dockerfile.
   - The Dockerfile runs `npx prisma generate` and `npm run build` during build stage.

5) Prisma Migrations / Seeding
   - If you need to run migrations, use Render Shell or a one-off job to run:

     npx prisma migrate deploy

   - To seed or populate sample data (optional):

     node scripts/registry-sample-data.js

6) Health check & Port
   - The app listens on process.env.PORT (Render sets the port automatically). The Dockerfile exposes 3000.

7) Optional: Add a `render.yaml` in repo root (already added) to define the service as Infrastructure as Code.

Notes & Troubleshooting
- If Prisma client fails during runtime because the client wasn't generated, ensure the build step runs `npx prisma generate` (Dockerfile already does this).
- If you use Render Postgres addon, paste the provided DATABASE_URL into Render env.
- If seeds try to create resources with strict FKs, run seeds after the database has the referenced rows (or adjust the seed logic).

If you want, I can:
- Add a Render `cron` or background job to run migrations automatically during deploy.
- Add a Health endpoint or readiness probe configuration.
