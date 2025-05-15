import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get Supabase environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    // Mask the key for security (show only first 10 characters)
    const maskedKey = supabaseAnonKey
      ? `${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.slice(-5)}`
      : "not set";

    return NextResponse.json({
      status: "success",
      connection_details: {
        url: supabaseUrl || "not set",
        key_status: supabaseAnonKey ? "set" : "not set",
        masked_key: maskedKey,
        env_loaded:
          !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
          !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    });
  } catch (error) {
    console.error("Error checking Supabase info:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error checking Supabase info",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
