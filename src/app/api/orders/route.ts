import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

function validateOrder(body: Record<string, unknown>): Record<string, string> | null {
  const fields: Record<string, string> = {};

  if (!Array.isArray(body.items) || body.items.length === 0) {
    fields["items"] = "Must be a non-empty array";
  } else {
    for (let i = 0; i < (body.items as unknown[]).length; i++) {
      const item = (body.items as Record<string, unknown>[])[i];
      if (!item.slug) fields[`items[${i}].slug`] = "Required";
      if (!item.name) fields[`items[${i}].name`] = "Required";
      if (typeof item.price !== "number") fields[`items[${i}].price`] = "Must be a number";
      if (typeof item.quantity !== "number" || item.quantity < 1)
        fields[`items[${i}].quantity`] = "Must be a positive integer";
    }
  }

  if (typeof body.subtotal !== "number" || body.subtotal <= 0) {
    fields["subtotal"] = "Must be a positive number";
  }

  const customer = body.customer as Record<string, unknown> | undefined;
  if (!customer || typeof customer !== "object") {
    fields["customer"] = "Required";
  } else {
    const required = ["name", "email", "address", "city", "postalCode", "country"];
    for (const field of required) {
      if (!customer[field] || typeof customer[field] !== "string") {
        fields[`customer.${field}`] = "Required";
      }
    }
  }

  return Object.keys(fields).length > 0 ? fields : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationErrors = validateOrder(body);
    if (validationErrors) {
      return NextResponse.json(
        { success: false, error: "Validation failed", fields: validationErrors },
        { status: 400, headers: CORS }
      );
    }

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

    for (const item of body.items) {
      await supabase.rpc("decrement_stock", {
        product_slug: item.slug,
        qty: item.quantity,
      });
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        status: "pending",
        message: "Order received. We will confirm via email and arrange payment.",
      },
      { headers: CORS }
    );
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500, headers: CORS }
    );
  }
}
