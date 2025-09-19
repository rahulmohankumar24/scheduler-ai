// app/lib/db.ts
import { createClient } from "@supabase/supabase-js";

const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCampaignByNumber(phoneNumber: string) {
  const { data, error } = await supabaseServer
    .from("campaigns")
    .select("*")
    .eq("phone_number", phoneNumber)
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
}
