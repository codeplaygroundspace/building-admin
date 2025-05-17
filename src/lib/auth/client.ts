import { createBrowserClient } from "@supabase/ssr";
import { type Session } from "@supabase/supabase-js";

export function createClientSide() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getClientSession(): Promise<Session | null> {
  const supabase = createClientSide();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
