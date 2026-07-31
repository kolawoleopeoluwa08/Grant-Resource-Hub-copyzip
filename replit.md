# Grant Resource Hub

A student grant application management platform. Applicants can browse, submit grant applications, and receive email confirmations. Admins manage applications through a private dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port from `$PORT`)
- `pnpm --filter @workspace/grants-website run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required Environment Variables

```
DATABASE_URL=          # Postgres connection string (auto-managed by Replit)
SESSION_SECRET=        # Secret for signing admin JWT tokens (Replit Secret)
GMAIL_USER=            # Gmail address used as sender
GMAIL_APP_PASSWORD=    # Gmail App Password (Replit Secret)
NOTIFY_EMAIL=          # Admin notification email address
ADMIN_EMAIL=           # Admin login email (Replit Secret)
ADMIN_PASSWORD=        # Admin login password (Replit Secret)
```

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind CSS v4, shadcn/ui, Wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod, drizzle-zod
- Email: Nodemailer (Gmail SMTP)
- Auth: HMAC-SHA256 signed JWT tokens (Node.js built-in crypto)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/grants-website/` — React frontend (public site)
- `artifacts/api-server/` — Express API server
- `lib/db/` — Drizzle ORM schema and DB client
- `lib/api-zod/` — Generated Zod schemas from OpenAPI spec
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-spec/` — OpenAPI spec (source of truth for codegen)

## Features

### Public Site
- Homepage with stats and testimonials
- Grant application form (`/apply`) — saves to DB, sends emails
- Testimonials page
- Contact form

### Admin Dashboard (`/admin/login`, `/admin/dashboard`)
- Secure login (email + password verified against env vars, HMAC-JWT session)
- Stats: total, pending, reviewing, approved, rejected counts
- Applications table with search and status filter
- Click any application to view full details
- Change application status (Pending → Reviewing → Approved → Rejected)

### Email Notifications
- Admin notification on every new application
- Applicant confirmation with unique Application ID (format: `GRH-YYYYMMDD-XXXXXX`)

## Architecture decisions

- Admin auth uses Node.js built-in `crypto` (HMAC-SHA256) — no extra package needed
- Application IDs are generated server-side: `GRH-{YYYYMMDD}-{random6}`
- Admin routes (`/api/admin/*`) are protected by `requireAdmin` middleware
- Status enum: `pending | reviewing | approved | rejected`
- Frontend admin pages bypass the public Layout (no navbar/footer)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `zod/v4` cannot be imported directly in the api-server (esbuild can't resolve it). Use `@workspace/api-zod` schemas or plain validation instead.
- Run `pnpm --filter @workspace/db run push` after every schema change to sync the DB.
