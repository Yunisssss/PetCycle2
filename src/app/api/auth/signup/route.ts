import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, username, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const fullName = `${(firstName || "").trim()} ${(lastName || "").trim()}`.trim();
    const cleanUsername = (username || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    const admin = createAdminClient();

    // Create user pre-confirmed so they can log in immediately
    const { data, error } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        username: cleanUsername,
        name: fullName,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during signup.",
      },
      { status: 500 }
    );
  }
}
