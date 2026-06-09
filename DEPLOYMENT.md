# Deploy to Render

This guide covers deploying the full **learn-kanji** application (Express API + Vite React client) to [Render.com](https://render.com) as a single Web Service.

## Architecture

```
Client (Vite / React)         Server (Express / TypeScript)
     │                              │
     │  build → client/dist/        │  build → server/dist/
     │                              │
     └────────── serve ─────────────┘
                    │
          Render Web Service
          (single process)
```

The Express server both:
- Handles API routes (`/api/*`)
- Serves the compiled client (`client/dist/`) as static files

## Prerequisites

| Service       | Purpose                          | Account Needed |
|---------------|----------------------------------|----------------|
| Render        | Hosting                          | render.com     |
| MongoDB Atlas | Database                         | mongodb.com    |
| Upstash Redis | Rate limiting + caching          | upstash.com    |
| Resend        | Transactional email              | resend.com     |
| GitHub        | Source control + Render sync     | github.com     |

## Environment Variables

These must be set in your Render Web Service dashboard under **Environment**:

| Variable                     | Description                              | Example                                   |
|------------------------------|------------------------------------------|-------------------------------------------|
| `MONGODB_URI`                | MongoDB Atlas connection string          | `mongodb+srv://...`                       |
| `JWT_SECRET`                 | 64+ char hex string for JWT signing      | `openssl rand -hex 64`                    |
| `RESEND_API_KEY`             | Resend API key                           | `re_xxxxxxxxxxxxxxxxxxxx`                 |
| `RESEND_FROM`                | Verified sender email in Resend          | `noreply@yourdomain.com`                  |
| `UPSTASH_REDIS_REST_URL`     | Upstash Redis REST URL                   | `https://xxxx.upstash.io`                 |
| `UPSTASH_REDIS_REST_TOKEN`   | Upstash Redis REST token                 | `xxxxxxxxxxxx`                            |
| `CLIENT_URL`                 | Public URL of your deployed app          | `https://learn-kanji.onrender.com`        |
| `PORT`                       | Port Render assigns (auto-set)           | `10000`                                   |
| `NODE_ENV`                   | Production mode                          | `production`                              |
| `SKIP_ENV_VALIDATION`        | Bypass env schema check on startup       | `true`                                    |

**Important:** Set `CLIENT_URL` to the full URL of your Render service (e.g. `https://learn-kanji.onrender.com`). Set `SKIP_ENV_VALIDATION=true` to avoid Zod env validation failing if any optional vars are missing startup order.

## Setup Steps

### 1. Push to GitHub

Push your repository to GitHub (Render will connect to it).

### 2. Create a Web Service on Render

1. In the Render Dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:

| Setting          | Value                                          |
|------------------|------------------------------------------------|
| **Name**         | `learn-kanji`                                  |
| **Runtime**      | Node                                           |
| **Build Command**| `npm install && npm run build`                  |
| **Start Command**| `node server/dist/index.js`                    |
| **Root Directory**| _(leave blank — use repo root)_               |
| **Plan**         | Starter or higher (512 MB RAM minimum)        |

4. Add all environment variables from the table above
5. Click **Create Web Service**

Render will build and deploy automatically.

### 3. MongoDB Atlas Network Access

In MongoDB Atlas, go to **Network Access** → **Add IP Address** and add `0.0.0.0/0` (allow all) to allow Render's dynamic IPs. For production, use [Render's static IPs](https://render.com/docs/static-ip) if needed.

### 4. First Deploy

The first deploy runs:
```bash
npm install          # installs root + all workspace deps
npm run build        # builds client (vite build) + server (tsc)
node server/dist/index.js  # starts Express on PORT env var
```

Check the **Logs** tab in Render to verify startup. You should see:
```
Server running on http://localhost:10000
MongoDB connected: learn-kanji
```

## Custom Domain (Optional)

1. Go to your Web Service → **Settings** → **Custom Domain**
2. Add your domain (Render provisions a free SSL certificate via Let's Encrypt)
3. Update `CLIENT_URL` env var to your custom domain
4. Update `RESEND_FROM` sender domain if using a custom email domain

## Troubleshooting

| Symptom                          | Likely Cause                              | Fix                                          |
|----------------------------------|-------------------------------------------|----------------------------------------------|
| Build fails on `tsc`             | TypeScript error in server code           | Run `npm run build` locally and fix errors   |
| 404 on page refresh (non-root)   | Client routing not handled by server      | Ensure server has catch-all `app.get('*')` (already in `server/src/index.ts:35`) |
| `MongoDB connection error`       | Atlas IP whitelist missing                | Add `0.0.0.0/0` to Atlas Network Access     |
| `Invalid environment variables`  | Zod env validation failure                | Set `SKIP_ENV_VALIDATION=true`               |
| Static files not served          | Wrong path to `client/dist/`              | Verify `clientDist` resolves correctly in `server/src/index.ts` |
| Rate limiting errors             | Missing Upstash Redis credentials         | Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` |
| Email not sending                | Resend domain not verified                | Verify sender domain in Resend dashboard     |

## Notes

- The monorepo uses **npm workspaces**. The root `npm install` installs dependencies for both `client/` and `server/` automatically.
- The client's `vite.config.ts` proxies `/api` to `localhost:3001` in development. In production, the server handles `/api` directly, so no proxy is needed.
- Render **auto-deploys** on every push to the default branch. To disable, go to **Settings** → **Auto-Deploy**.
