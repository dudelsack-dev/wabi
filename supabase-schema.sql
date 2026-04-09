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

-- Admin docs table (not publicly accessible — admin-only)
create table docs (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  content text not null,
  category text not null default 'General',
  order_index integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table docs enable row level security;

create policy "Auth read docs" on docs for select using (auth.role() = 'authenticated');
create policy "Auth insert docs" on docs for insert with check (auth.role() = 'authenticated');
create policy "Auth update docs" on docs for update using (auth.role() = 'authenticated');
create policy "Auth delete docs" on docs for delete using (auth.role() = 'authenticated');

-- Seed initial admin documentation
insert into docs (slug, title, content, category, order_index) values

('getting-started', 'Getting Started', '# Getting Started

Welcome to the Wabi admin dashboard. This guide covers everything you need to manage the site day-to-day.

## Logging In

Navigate to `/admin/login` and enter your email and password. Your session lasts 7 days before you need to log in again.

## Dashboard Overview

The main dashboard shows four summary cards at a glance:

- **Total Products** — number of active products in the catalogue
- **Low Stock** — products with fewer than 3 units remaining
- **Pending Orders** — orders awaiting confirmation
- **Recent Revenue** — total value of the last 30 days of orders

Below the cards you will find a **Recent Orders** table (last 5 orders) and a **Low Stock Alerts** list so you can restock before items sell out.

## Navigation

Use the left sidebar to move between sections:

| Section | Purpose |
|---|---|
| Dashboard | Summary and alerts |
| Products | Manage the product catalogue |
| Orders | View and update customer orders |
| Settings | Site-wide configuration |
| Docs | This documentation |

## Logging Out

Click **Sign out** at the bottom of the sidebar. This clears your session immediately.', 'General', 1),

('managing-products', 'Managing Products', '# Managing Products

## Viewing Products

Go to **Products** in the sidebar. The table shows each product''s image, name, category, price, and current stock level.

## Adding a New Product

1. Click **Add Product** (top right of the Products page).
2. Fill in all required fields:

| Field | Notes |
|---|---|
| Name | English product name |
| Japanese Name | Shown on the storefront in Japanese |
| Slug | URL-friendly identifier — auto-generated from the name, but can be edited |
| Description | Displayed on the product detail page |
| Price | In Japanese Yen (¥), enter as a whole number |
| Category | Either `pottery` or `kitchenware` |
| Artisan | Name of the maker |
| Origin | Region or prefecture of origin |
| Stock | Number of units available |
| Featured | Tick to show in the featured section on the homepage |

3. Upload at least one product image (see **Images** below).
4. Click **Save Product**.

## Editing a Product

Click the pencil icon next to any product in the list. All fields can be updated. Click **Save Product** when done.

> **Note:** Changing the slug will break any existing links to that product page. Avoid changing slugs on live products.

## Deleting a Product

Click the trash icon next to a product, then confirm the deletion in the modal. This action cannot be undone.

## Images

Use the image uploader on the product form to add photos:

- Click the dashed **+** area to select a file from your computer
- Images are stored in Supabase Storage
- You can add multiple images; the first image is used as the thumbnail in listings
- To remove an image, click the × on its thumbnail

Recommended image size: **800 × 800 px** or larger, square crop, JPEG or WebP.', 'Products', 2),

('managing-orders', 'Managing Orders', '# Managing Orders

## Viewing Orders

Go to **Orders** in the sidebar. Orders are listed with the most recent first. Each row shows:

- **Order ID** — unique reference number
- **Customer** — name and email
- **Items** — number of items in the order
- **Total** — order value in ¥
- **Status** — current fulfilment status
- **Date** — when the order was placed

Click any row to expand it and see the full item list and shipping address.

## Order Statuses

| Status | Meaning |
|---|---|
| `pending` | Order received, not yet reviewed |
| `confirmed` | Order acknowledged, being prepared |
| `shipped` | Dispatched — tracking details sent to customer manually |
| `delivered` | Confirmed received by customer |
| `cancelled` | Order cancelled |

## Updating an Order Status

Use the dropdown in the **Status** column to change the status. The change saves immediately — there is no confirmation step.

## Typical Fulfilment Workflow

1. New order arrives → status is **pending**
2. Review the order and stock → set to **confirmed**
3. Pack and dispatch → set to **shipped**, contact customer with tracking info
4. Confirm delivery → set to **delivered**

## Refunds & Cancellations

The admin panel does not process refunds automatically. To cancel an order:

1. Set the status to **cancelled**
2. Handle any payment refund directly through your payment processor
3. Re-stock the items manually by editing the product stock level', 'Orders', 3),

('site-settings', 'Site Settings', '# Site Settings

## Accessing Settings

Go to **Settings** in the sidebar.

## Hero Image

The hero image is the large banner displayed at the top of the homepage.

To update it:

1. Click **Upload Image** and select a file, **or** paste a direct image URL into the text field
2. A preview will appear below the field
3. Click **Save Settings**

Recommended hero image size: **1600 × 900 px** or wider, JPEG or WebP. Keep the file size under 500 KB for fast page loads.

> Images uploaded through the settings panel are stored in Supabase Storage alongside product images.

## Adding New Settings

Additional site-wide settings (e.g. announcement banners, contact email) can be added by a developer by inserting a new key–value row into the `settings` table in Supabase and updating the relevant frontend component.', 'Settings', 4),

('troubleshooting', 'Troubleshooting', '# Troubleshooting

## I cannot log in

- Double-check your email and password.
- Make sure you are using the admin credentials — regular customer accounts cannot access the admin panel.
- If you have forgotten your password, reset it via the Supabase dashboard under **Authentication → Users**.

## Images are not uploading

- Check that the `product-images` storage bucket exists in Supabase and has the correct public/private settings.
- Verify that the `SUPABASE_SERVICE_ROLE_KEY` environment variable is set correctly in your hosting environment.
- File size limit is typically 50 MB per upload; keep product images well under this.

## An order status is not saving

- Refresh the page and try again.
- If the problem persists, check the Supabase dashboard for any RLS policy errors under **Logs → Edge Functions**.

## Stock is not decrementing after an order

- The `decrement_stock` function in the database handles this automatically on order creation.
- If stock is not decreasing, check that the function exists in Supabase under **Database → Functions**.
- Also confirm the order was actually created successfully (check the **Orders** page).

## A product page returns 404

- The product slug in the URL must exactly match the slug stored in the database.
- Avoid changing slugs on live products. If a slug was changed, update any marketing links or redirect the old URL.

## Need further help?

Contact your developer with a description of the issue, any error messages you saw, and the approximate time it occurred.', 'General', 5);
