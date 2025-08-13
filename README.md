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
-- 1. Table for chat history
create table if not exists chat_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    role text not null, -- 'user' atau 'assistant'
    content text not null,
    model text default 'gpt-3.5-turbo',
    created_at timestamp with time zone default now()
);

-- 2. Table for scheduled prompts
create table if not exists scheduled_prompts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    prompt text not null,
    model text default 'gpt-3.5-turbo',
    schedule_time time not null,
    frequency text default 'daily', -- daily / weekly / monthly
    max_notifications int default 2,
    created_at timestamp with time zone default now()
);

-- 3. Table for subscriptions
create table if not exists subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    plan text default 'free', -- free / pro
    created_at timestamp with time zone default now()
);

-- Activated RLS
alter table chat_history enable row level security;
alter table scheduled_prompts enable row level security;
alter table subscriptions enable row level security;

-- Policies for chat_history
create policy "chat_history_select_own"
    on chat_history for select
    using (auth.uid() = user_id);

create policy "chat_history_insert_own"
    on chat_history for insert
    with check (auth.uid() = user_id);

-- Policies for scheduled_prompts
create policy "scheduled_prompts_select_own"
    on scheduled_prompts for select
    using (auth.uid() = user_id);

create policy "scheduled_prompts_insert_own"
    on scheduled_prompts for insert
    with check (auth.uid() = user_id);

create policy "scheduled_prompts_update_own"
    on scheduled_prompts for update
    using (auth.uid() = user_id);

create policy "scheduled_prompts_delete_own"
    on scheduled_prompts for delete
    using (auth.uid() = user_id);

-- Policies for subscriptions
create policy "subscriptions_select_own"
    on subscriptions for select
    using (auth.uid() = user_id);

create policy "subscriptions_insert_own"
    on subscriptions for insert
    with check (auth.uid() = user_id);

create policy "subscriptions_update_own"
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
