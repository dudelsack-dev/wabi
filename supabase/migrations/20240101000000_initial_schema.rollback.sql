-- Rollback: initial schema
-- Removes everything added by 20240101000000_initial_schema.sql
-- Apply in the Supabase SQL editor to fully undo the initial migration
-- WARNING: This destroys all product and order data. Backup first.

-- Drop order RLS policies
drop policy if exists "Auth update orders" on orders;
drop policy if exists "Auth read orders" on orders;
drop policy if exists "Public insert orders" on orders;

-- Drop product RLS policies
drop policy if exists "Auth delete products" on products;
drop policy if exists "Auth update products" on products;
drop policy if exists "Auth insert products" on products;
drop policy if exists "Public read products" on products;

-- Drop function
drop function if exists decrement_stock(text, int);

-- Drop tables (orders first — no FK constraint, but orders depend on products conceptually)
drop table if exists orders;
drop table if exists products;
