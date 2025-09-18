import { Pool } from "pg";

const isVercel = !!process.env.VERCEL;

export const pool = new Pool({
  connectionString: isVercel
    ? process.env.POSTGRES_URL   // pooler (Vercel)
    : process.env.DATABASE_URL  // direct (local dev
});

// Fetch a campaign by phone number
export async function getCampaignByNumber(phoneNumber: string) {
  const { rows } = await pool.query(
    "SELECT * FROM campaigns WHERE phone_number = $1",
    [phoneNumber]
  );
  return rows[0] || null;
}

// Add a new campaign
export async function addCampaign(
  phoneNumber: string,
  openTime: string,
  closeTime: string,
  forwardNumber: string
) {
  await pool.query(
    "INSERT INTO campaigns (phone_number, open_time, close_time, forward_number) VALUES ($1, $2, $3, $4)",
    [phoneNumber, openTime, closeTime, forwardNumber]
  );
}
