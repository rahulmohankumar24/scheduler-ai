import { sql } from "@vercel/postgres";

// Fetch a campaign by phone number
export async function getCampaignByNumber(phoneNumber: string) {
  const { rows } = await sql`
    SELECT * FROM campaigns WHERE phone_number = ${phoneNumber};
  `;
  return rows[0] || null;
}

// Add a new campaign
export async function addCampaign(phoneNumber: string, openTime: string, closeTime: string, forwardNumber: string) {
  await sql`
    INSERT INTO campaigns (phone_number, open_time, close_time, forward_number)
    VALUES (${phoneNumber}, ${openTime}, ${closeTime}, ${forwardNumber});
  `;
}
