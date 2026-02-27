"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/products";
import { Package, AlertTriangle, ShoppingCart, TrendingUp } from "lucide-react";

interface DashboardData {
  totalProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  recentRevenue: number;
  recentOrders: Array<{
    id: string;
    customer: { name: string; email: string };
    subtotal: number;
    status: string;
    created_at: string;
  }>;
  lowStockProducts: Array<{
    slug: string;
    name: string;
    stock: number;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient();

      const [productsRes, ordersRes, lowStockRes] = await Promise.all([
        supabase.from("products").select("stock"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("slug, name, stock").lt("stock", 3).order("stock"),
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const lowStock = lowStockRes.data || [];

      setData({
        totalProducts: products.length,
        lowStockCount: lowStock.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        recentRevenue: orders.reduce((sum, o) => sum + (o.subtotal || 0), 0),
        recentOrders: orders,
        lowStockProducts: lowStock,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone">Loading...</p>
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    { label: "Total Products", value: data.totalProducts, icon: Package },
    { label: "Low Stock", value: data.lowStockCount, icon: AlertTriangle },
    { label: "Pending Orders", value: data.pendingOrders, icon: ShoppingCart },
    { label: "Recent Revenue", value: formatPrice(data.recentRevenue), icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-warm-white border border-cream p-5 rounded-md">
              <div className="flex items-center gap-3 mb-2">
                <Icon size={18} className="text-stone" />
                <span className="text-xs uppercase tracking-wide text-stone">{card.label}</span>
              </div>
              <p className="text-xl font-medium text-charcoal">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-warm-white border border-cream rounded-md p-6">
          <h2 className="text-sm uppercase tracking-wide text-stone mb-4">Recent Orders</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-stone-dark">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-sm border-b border-cream pb-3 last:border-0">
                  <div>
                    <p className="text-charcoal font-medium">{order.customer?.name || "—"}</p>
                    <p className="text-xs text-stone">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-charcoal">{formatPrice(order.subtotal)}</p>
                    <p className="text-xs text-stone capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-warm-white border border-cream rounded-md p-6">
          <h2 className="text-sm uppercase tracking-wide text-stone mb-4">Low Stock Alerts</h2>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-stone-dark">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <div key={product.slug} className="flex items-center justify-between text-sm border-b border-cream pb-3 last:border-0">
                  <p className="text-charcoal">{product.name}</p>
                  <span className="text-xs px-2 py-1 bg-earth-red/10 text-earth-red rounded">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
