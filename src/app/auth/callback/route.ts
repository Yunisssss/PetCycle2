import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = profile?.role;

        if (role === "superadmin") {
          return NextResponse.redirect(`${origin}/dashboard/superadmin`);
        } else if (role === "shelter") {
          return NextResponse.redirect(`${origin}/dashboard/shelter`);
        } else {
          return NextResponse.redirect(`${origin}/app`);
        }
      }
    }
  }

  // Fallback if exchange fails or user profile cannot be found
  return NextResponse.redirect(`${origin}/?error=auth_callback_failed`);
}
