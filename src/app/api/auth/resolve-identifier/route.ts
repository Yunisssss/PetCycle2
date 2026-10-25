import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { identifier } = await request.json();
    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json({ email: null });
    }

    const term = identifier.trim().toLowerCase();
    const admin = createAdminClient();

    // 1. If it's an email format, check if confirmation is needed and auto-confirm
    if (term.includes("@")) {
      const { data: usersData } = await admin.auth.admin.listUsers();
      const matched = usersData.users.find(
        (u) => u.email?.toLowerCase() === term
      );

      if (matched && !matched.email_confirmed_at) {
        await admin.auth.admin.updateUserById(matched.id, {
          email_confirm: true,
        });
      }

      return NextResponse.json({ email: term });
    }

    // 2. Lookup in profiles by display_name or full_name
    const { data: profile } = await admin
      .from("profiles")
      .select("email, id")
      .or(`display_name.ilike."${term}",full_name.ilike."${term}"`)
      .limit(1)
      .maybeSingle();

    if (profile?.email) {
      // Ensure email is confirmed
      await admin.auth.admin.updateUserById(profile.id, {
        email_confirm: true,
      });
      return NextResponse.json({ email: profile.email });
    }

    // 3. Lookup in auth.users by username or full_name metadata
    const { data: usersData } = await admin.auth.admin.listUsers();
    const matchedUser = usersData.users.find(
      (u) =>
        (u.user_metadata?.username &&
          String(u.user_metadata.username).toLowerCase() === term) ||
        (u.user_metadata?.full_name &&
          String(u.user_metadata.full_name).toLowerCase() === term)
    );

    if (matchedUser?.email) {
      if (!matchedUser.email_confirmed_at) {
        await admin.auth.admin.updateUserById(matchedUser.id, {
          email_confirm: true,
        });
      }
      return NextResponse.json({ email: matchedUser.email });
    }

    return NextResponse.json({ email: null });
  } catch (err: unknown) {
    return NextResponse.json(
      { email: null, error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
