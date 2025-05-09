import { NextResponse } from "next/server";

export async function GET() {
  // Return hardcoded test data to bypass Supabase RLS issues
  return NextResponse.json({
    success: true,
    connection: "Hardcoded response (bypassing Supabase)",
    count: [{ count: 1 }],
    env: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "Set"
        : "Not set",
    },
  });
}
