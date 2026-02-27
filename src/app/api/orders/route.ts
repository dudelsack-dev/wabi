import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServerClient();

    const order = {
      id: `wabi-${Date.now()}`,
      items: body.items,
      subtotal: body.subtotal,
      customer: body.customer,
      status: "pending",
    };

    const { error: orderError } = await supabase.from("orders").insert(order);
    if (orderError) throw orderError;

    // Decrement stock for each item
    for (const item of body.items) {
      await supabase.rpc("decrement_stock", {
        product_slug: item.slug,
        qty: item.quantity,
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
