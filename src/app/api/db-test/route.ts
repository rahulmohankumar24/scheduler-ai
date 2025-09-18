import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");
    return NextResponse.json({ success: true, time: result.rows[0].now });
  } catch (err: any) {
    console.error("DB connection error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
