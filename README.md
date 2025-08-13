# RemindMe — Chat + Scheduled Prompts + Multi-Model (OpenAI) + Supabase Auth

A ChatGPT-style web app with:
- Email/password auth (Supabase)
- Normal chat with model selector
- Scheduled prompts with preview and email delivery (SendGrid)
- Simple subscription gate (free: 2 schedules max; pro: 10)

## Stack
- Next.js (pages router) + TypeScript
- Tailwind CSS (basic)
- Supabase (Auth, DB)
- OpenAI (models, easily extendable)
- SendGrid (email delivery)
- Vercel (hosting + Cron)

## Quick Start (Deploy-first)
1) **Create new GitHub repo** and push this folder.
2) **Create Supabase project** and set the SQL below.
3) **Import repo into Vercel**. Add env variables (see `.env.example`). Enable a **Cron Job** calling `/api/runSchedule` every minute.
4) **Add Sender in SendGrid** (single sender) and verify it.
5) Open the deployed site → Register → Chat → Create Scheduled Prompt → Verify email delivery.

## Environment Variables (.env)
Copy `.env.example` to `.env.local` (for local) or set in Vercel Project Settings:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

OPENAI_API_KEY=...

SENDGRID_API_KEY=...
FROM_EMAIL=you@yourdomain.com
```

## Supabase SQL
Run this in **SQL Editor**:
```sql
-- Enable pgcrypto (for gen_random_uuid) if not already
create extension if not exists pgcrypto;

create table if not exists chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content text not null,
  model text not null,
  created_at timestamp with time zone default now()
);

create table if not exists scheduled_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  prompt text not null,
  model text not null,
  schedule_time timestamp with time zone not null,
  channel text not null, -- 'email' | 'telegram'
  created_at timestamp with time zone default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  plan text not null default 'free', -- 'free' | 'pro'
  max_scheduled int not null default 2, -- free users get 2
  created_at timestamp with time zone default now()
);

-- Policy templates (row level security optional, keep simple for demo)
alter table chat_history enable row level security;
alter table scheduled_prompts enable row level security;
alter table subscriptions enable row level security;

create policy if not exists "chat_history_select_own"
on chat_history for select
using (auth.uid() = user_id);

create policy if not exists "chat_history_insert_own"
on chat_history for insert
with check (auth.uid() = user_id);

create policy if not exists "scheduled_prompts_select_own"
on scheduled_prompts for select
using (auth.uid() = user_id);

create policy if not exists "scheduled_prompts_ins_own"
on scheduled_prompts for insert
with check (auth.uid() = user_id);

create policy if not exists "scheduled_prompts_del_own"
on scheduled_prompts for delete
using (auth.uid() = user_id);

create policy if not exists "subscriptions_select_own"
on subscriptions for select
using (auth.uid() = user_id);

create policy if not exists "subscriptions_upsert_own"
on subscriptions for insert
with check (auth.uid() = user_id);

create policy if not exists "subscriptions_update_own"
on subscriptions for update
using (auth.uid() = user_id);
```

## Vercel Cron
- Create a cron that calls `GET https://<your-deployment-domain>/api/runSchedule` every minute (or every 5 minutes).
- The handler matches jobs within ±1 minute of `schedule_time` (server time). Schedule using local user time converted to ISO.

## Extend Models
See `lib/aiClients.ts`. Add new providers and route via `getAiResponse`.

## Notes
- This is a minimal, production-leaning starter. For serious usage, add rate limiting, queues, better error handling, and Stripe for paid subscriptions.


### Optional: Profiles table for email
To let `/api/runSchedule` know the recipient email, create a simple `profiles` table:
```sql
create table if not exists profiles (
  id uuid primary key,        -- equals auth.uid()
  email text not null
);
-- RLS
alter table profiles enable row level security;
create policy if not exists "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy if not exists "profiles_upsert_own" on profiles for insert with check (auth.uid() = id);
create policy if not exists "profiles_update_own" on profiles for update using (auth.uid() = id);
```
Make sure to insert your email after signup, e.g. via a simple form or SQL.
