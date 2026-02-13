import FormEditorClient from "@/lib/editor/FormEditorClient";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("forms")
    .select("id, schema, user_id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.log("DB error:", error);
    return <div>Form not found</div>;
  }

  // --- AUTH + PERMISSION CHECK ---
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if form has NO owner → allow anonymous editing
  if (!data.user_id) {
    return (
      <FormEditorClient
        initialForm={data.schema}
        formId={data.id}
        collaborators={[]}
      />
    );
  }

  // if user not logged in → redirect
  if (!user) {
    redirect("/login");
  }

  // owner
  if (user.id !== data.user_id) {
    const { data: member } = await supabase
      .from("form_members")
      .select("id")
      .eq("form_id", data.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!member) {
      redirect("/dashboard");
    }
  }

  const { data: members } = await supabase
    .from("form_members")
    .select("user_id, role")
    .eq("form_id", data.id);

  const memberIds = members?.map((m) => m.user_id) ?? [];

  let users: any[] = [];

  if (memberIds.length) {
    const { data: usersData } = await supabase.auth.admin.listUsers({
      // cannot filter by ids → fetch all page 1 for now
      page: 1,
      perPage: 100,
    } as any);

    users = usersData?.users ?? [];
  }

  const ownerUser = users.find((u) => u.id === data.user_id) ?? null;

  const collaborators = [
    ...(ownerUser
      ? [
          {
            id: ownerUser.id,
            email: ownerUser.email,
            role: "owner",
          },
        ]
      : []),

    ...(members?.map((m) => {
      const u = users.find((x) => x.id === m.user_id);
      return {
        id: m.user_id,
        email: u?.email ?? "unknown",
        role: m.role,
      };
    }) ?? []),
  ];

  const form = data.schema;

  return (
    <FormEditorClient
      initialForm={form}
      formId={data.id}
      collaborators={collaborators}
    />
  );
}
