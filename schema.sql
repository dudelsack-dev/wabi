-- Footprint DB schema — run against your Supabase project

create table if not exists footprint_intents (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text not null check (type in ('WANT', 'HAVE', 'REVOKED')),
  category text not null,
  item text not null,
  brand text,
  confidence float not null default 1.0,
  active boolean not null default true,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists footprint_intents_user_active on footprint_intents (user_id, active);
create index if not exists footprint_intents_user_type on footprint_intents (user_id, type);

-- Auto-update updated_at
create or replace function footprint_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger footprint_intents_updated_at
  before update on footprint_intents
  for each row execute procedure footprint_set_updated_at();

create table if not exists footprint_platform_configs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  platform text not null,
  enabled boolean not null default false,
  credentials jsonb,
  last_synced_at timestamptz,
  unique (user_id, platform)
);

create table if not exists footprint_sync_logs (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid references footprint_intents(id) on delete cascade,
  platform text not null,
  status text not null check (status in ('success', 'failure', 'pending')),
  response jsonb,
  synced_at timestamptz not null default now()
);
