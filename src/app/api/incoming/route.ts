import { NextResponse } from "next/server";
import { getCampaignByNumber } from "@/app/lib/db";
import { twiml } from "twilio";
import { Pool } from "pg";
export const runtime = "nodejs";
export async function POST(req: Request) {
  
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

  const formData = await req.formData();
  const fromNumber = formData.get("From") as string;
  const toNumber = formData.get("To") as string;

  // Lookup campaign
  const campaign = await getCampaignByNumber(toNumber);

  const voiceResponse = new twiml.VoiceResponse();

  voiceResponse.say("We are currently open.");

  if (!campaign) {
    voiceResponse.say("This number is not recognized.");
    return new Response(voiceResponse.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Check working hours
  const now = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: campaign.timezone,
  });

  if (now >= campaign.open_time && now <= campaign.close_time) {
    voiceResponse.say("We are currently open.");
    // voiceResponse.dial(campaign.phone_number);
  } else {
    voiceResponse.say("We are currently closed. Connecting you to our AI assistant...");
    // voiceResponse.redirect("https://your-voice-ai-agent-url.com");
  }

  return new Response(voiceResponse.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
