import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Every Google sign-in routes directly to the community app (/app)
      return NextResponse.redirect(`${origin}/app`);
    }
  }

  // Fallback if exchange fails or user profile cannot be found
  return NextResponse.redirect(`${origin}/?error=auth_callback_failed`);
}
