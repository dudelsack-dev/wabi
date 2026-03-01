import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  if (!token) return false;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { error } = await supabase.auth.getUser(token);
  return !error;
}

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("settings").select("key, value");
    if (error) throw error;

    const settings: Record<string, string> = {};
    for (const row of data ?? []) {
      settings[row.key] = row.value;
    }
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = createServerClient();

    // body is expected to be { key: string, value: string }[]  or  { [key]: value }
    const rows: { key: string; value: string }[] = Array.isArray(body)
      ? body
      : Object.entries(body).map(([key, value]) => ({ key, value: String(value) }));

    const { error } = await supabase
      .from("settings")
      .upsert(rows, { onConflict: "key" });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Put settings error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
