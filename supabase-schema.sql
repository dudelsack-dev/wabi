-- Wabi Supabase Schema
-- Run this in the Supabase SQL editor after creating your project.

-- Products table (replaces products.json)
create table products (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  name_jp text not null,
  description text not null,
  price integer not null,
  images text[] not null default '{}',
  category text not null check (category in ('pottery', 'kitchenware')),
  artisan text not null,
  origin text not null,
  stock integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table (replaces orders.json)
create table orders (
  id text primary key,
  items jsonb not null,
  subtotal integer not null,
  customer jsonb not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Stock decrement function
create or replace function decrement_stock(product_slug text, qty int)
returns void as $$
  update products set stock = stock - qty, updated_at = now()
  where slug = product_slug and stock >= qty;
$$ language sql;

-- RLS policies
alter table products enable row level security;
alter table orders enable row level security;

create policy "Public read products" on products for select using (true);
create policy "Auth insert products" on products for insert with check (auth.role() = 'authenticated');
create policy "Auth update products" on products for update using (auth.role() = 'authenticated');
create policy "Auth delete products" on products for delete using (auth.role() = 'authenticated');

create policy "Public insert orders" on orders for insert with check (true);
create policy "Auth read orders" on orders for select using (auth.role() = 'authenticated');
create policy "Auth update orders" on orders for update using (auth.role() = 'authenticated');
