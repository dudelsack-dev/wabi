"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/products";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OrderRow {
  id: string;
  items: Array<{ slug: string; name: string; price: number; quantity: number }>;
  subtotal: number;
  customer: { name: string; email: string; address: string; city: string; postalCode: string; country: string };
  status: string;
  created_at: string;
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders((data as OrderRow[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-warm-white border border-cream rounded-md p-8 text-center">
          <p className="text-stone-dark">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-warm-white border border-cream rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Order ID</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Customer</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Items</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Total</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Date</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="border-b border-cream hover:bg-cream-light transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3 text-charcoal font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3 text-charcoal">{order.customer?.name || "—"}</td>
                    <td className="px-4 py-3 text-stone-dark">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 text-charcoal">{formatPrice(order.subtotal)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 border border-stone-light/50 rounded bg-warm-white focus:outline-none"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-stone text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-stone">
                      {expandedId === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-detail`} className="border-b border-cream bg-cream-light/50">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-stone mb-2">Items</p>
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex justify-between py-1 text-charcoal">
                                <span>{item.name} &times; {item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-stone mb-2">Shipping</p>
                            <p className="text-charcoal">{order.customer?.name}</p>
                            <p className="text-stone-dark">{order.customer?.email}</p>
                            <p className="text-stone-dark">{order.customer?.address}</p>
                            <p className="text-stone-dark">{order.customer?.city} {order.customer?.postalCode}</p>
                            <p className="text-stone-dark">{order.customer?.country}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
