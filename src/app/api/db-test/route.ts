// app/api/db-test/route.ts
import { NextResponse } from "next/server";
import { getCampaignByNumber } from "@/app/lib/db";

export async function GET() {
  try {
    const campaign = await getCampaignByNumber("(442) 267-1113"); // test number
    return NextResponse.json({ success: true, campaign });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
