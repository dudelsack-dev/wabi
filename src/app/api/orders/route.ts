import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = {
      id: `wabi-${Date.now()}`,
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("New order received:", JSON.stringify(order, null, 2));

    // Write to local orders file
    const ordersPath = path.join(process.cwd(), "orders.json");
    let orders = [];
    try {
      const existing = fs.readFileSync(ordersPath, "utf-8");
      orders = JSON.parse(existing);
    } catch {
      // file doesn't exist yet
    }
    orders.push(order);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, orderId: order.id });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
