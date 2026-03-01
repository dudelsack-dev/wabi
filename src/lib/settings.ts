import { createServerClient } from "@/lib/supabase";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();
    return data?.value ?? fallback;
  } catch {
    return fallback;
  }
}
