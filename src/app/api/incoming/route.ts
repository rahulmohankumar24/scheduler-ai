// app/api/call/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { twiml } from "twilio";
import { log } from "console";

export const runtime = "nodejs";

// Initialize Supabase client with service role key (server-only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to fetch campaign by phone number
async function getCampaignByNumber(phoneNumber: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("phone_number", phoneNumber)
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const fromNumber = formData.get("From") as string;
  const toNumber = formData.get("To") as string;

  // Lookup campaign
  console.log("Incoming call to:", toNumber, "from:", fromNumber);
  const campaign = await getCampaignByNumber(toNumber);

  const voiceResponse = new twiml.VoiceResponse();
  

  if (!campaign) {
    voiceResponse.say("This number is not recognized.");
    return new Response(voiceResponse.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  const now = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: campaign.timezone,
  });

  if (now >= campaign.open_time && now <= campaign.close_time) {
    voiceResponse.say("We are currently open.");
    // voiceResponse.dial(campaign.forward_number); // optional: forward call
  } else {
    voiceResponse.say("We are currently closed. Connecting you to our AI assistant...");
    // voiceResponse.redirect("https://your-voice-ai-agent-url.com");
  }

  return new Response(voiceResponse.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
