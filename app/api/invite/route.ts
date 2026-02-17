import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* ----------------------------- */
/* Admin client (service role)   */
/* ----------------------------- */
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { email, formId } = await req.json();

    if (!email || !formId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    /* ----------------------------- */
    /* Session client (who is inviting) */
    /* ----------------------------- */
    const cookieStore = await cookies();
    type CookieOptions = Parameters<typeof cookieStore.set>[2];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          },
        },
      },
    );

    const {
      data: { user: requester },
    } = await supabase.auth.getUser();

    if (!requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ----------------------------- */
    /* Fetch form owner              */
    /* ----------------------------- */
    const { data: form, error: formError } = await admin
      .from("forms")
      .select("id, user_id")
      .eq("id", formId)
      .single();

    if (formError || !form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    /* Only owner can invite */
    if (requester.id !== form.user_id) {
      return NextResponse.json(
        { error: "Only owner can invite" },
        { status: 403 },
      );
    }

    /* ----------------------------- */
    /* Find user by email            */
    /* ----------------------------- */
    // Supabase admin.listUsers does NOT filter by email reliably.
    // We fetch and then find manually.
    const { data: usersData, error: userError } =
      await admin.auth.admin.listUsers();

    if (userError) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 },
      );
    }

    const invitedUser = usersData?.users?.find(
      (u: User) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    if (userError || !invitedUser) {
      return NextResponse.json(
        { error: "User not found. They must sign up first." },
        { status: 404 },
      );
    }

    /* Prevent inviting owner */
    if (invitedUser.id === form.user_id) {
      return NextResponse.json(
        { error: "User is already owner" },
        { status: 400 },
      );
    }

    /* Prevent duplicate invite */
    const { data: existing } = await admin
      .from("form_members")
      .select("id")
      .eq("form_id", formId)
      .eq("user_id", invitedUser.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "User already has access" },
        { status: 400 },
      );
    }

    /* ----------------------------- */
    /* Insert collaborator           */
    /* ----------------------------- */
    const { error: insertError } = await admin.from("form_members").insert({
      form_id: formId,
      user_id: invitedUser.id,
      role: "editor",
    });

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      invitedUser: {
        id: invitedUser.id,
        email: invitedUser.email,
      },
    });
  } catch (err) {
    console.error("INVITE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
