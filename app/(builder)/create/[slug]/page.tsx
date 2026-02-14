import FormEditorClient from "@/lib/editor/FormEditorClient";
import CollaboratorsLiveRefresh from "./CollaboratorsLiveRefresh";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NavbarAvatar } from "@/components/navbar/avatar";
import { getUsersByIds } from "@/lib/server/getUsersByIds";
import { Badge } from "@/components/ui/badge";
import { CircleMinus, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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
  let formOwnerId = data.user_id;

  // Backfill owner for legacy rows created without user_id.
  if (!formOwnerId && user) {
    await admin
      .from("forms")
      .update({ user_id: user.id })
      .eq("id", data.id)
      .is("user_id", null);
    formOwnerId = user.id;
  }

  // If form has NO owner → allow anonymous editing
  if (!formOwnerId) {
    return (
      <FormEditorClient
        initialForm={data.schema}
        formId={data.id}
        isOwner={!!user}
      />
    );
  }

  // If user not logged in → redirect to login
  if (!user) {
    redirect("/login");
  }

  // If user is not owner → check membership
  if (user.id !== formOwnerId) {
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

  // --- COLLABORATORS (SAFE VERSION) ---
  // We only fetch IDs + roles here.
  // Emails will be resolved later via secure API route.

  const { data: members } = await supabase
    .from("form_members")
    .select("user_id, role")
    .eq("form_id", data.id);

  const allIds = [formOwnerId, ...(members ?? []).map((m) => m.user_id)];

  const users = await getUsersByIds(allIds);

  function getName(id: string) {
    const u = users.find((u) => u.id === id);
    if (!u) return "";

    // Prefer Google/GitHub full name if available
    const metadata = u.user_metadata as { full_name?: string } | null;
    const full = metadata?.full_name;
    if (full) return full.split(" ")[0];

    // fallback → email prefix
    return u.email?.split("@")[0] || "";
  }

  const collaborators = [
    {
      id: formOwnerId,
      email: getName(formOwnerId),
      role: "owner",
    },
    ...(members ?? []).map((m) => ({
      id: m.user_id,
      email: getName(m.user_id),
      role: m.role,
    })),
  ];

  return (
    <div className="flex w-full">
      <CollaboratorsLiveRefresh formId={data.id} />

      {/* Collaborators sidebar */}
      <aside className="w-64 border-r px-4 py-6 space-y-4 bg-white">
        {/* Avatar */}
        {user && (
          <div className="flex items-center gap-3 pb-4 border-b">
            <NavbarAvatar user={user} />
            <div className="text-sm font-medium truncate">
              {user.user_metadata?.full_name
                ? user.user_metadata.full_name.split(" ")[0]
                : user.email?.split("@")[0]}
            </div>
          </div>
        )}

        <div className="text-md flex items-center gap-2 font-semibold text-pink-500">
          {" "}
          <Sparkles size={20} />
          Collaborators
        </div>

        <div className="space-y-2">
          {collaborators.map((c) => (
            <div
              key={`${c.id}-${c.role}`}
              className="flex items-center justify-between text-sm font-semibold rounded-md px-2 py-1 hover:bg-neutral-100"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`truncate ${
                    c.role === "owner" ? "text-neutral-800" : "text-neutral-500"
                  }`}
                >
                  {c.email ? c.email.split("@")[0] : "Member"}
                </span>

                <Badge
                  variant="secondary"
                  className={`h-5 px-1.5 text-[10px] font-medium border-none ${
                    c.role === "owner"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {c.role === "owner" ? "Owner" : "Member"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {/* Owner can remove editors */}
                {user?.id === formOwnerId && c.role !== "owner" && (
                  <form
                    action={async () => {
                      "use server";
                      const supabase = await createServerSupabase();
                      const {
                        data: { user: requester },
                      } = await supabase.auth.getUser();

                      if (!requester) {
                        redirect("/login");
                      }

                      const { data: form } = await admin
                        .from("forms")
                        .select("user_id")
                        .eq("id", data.id)
                        .maybeSingle();

                      if (
                        !form ||
                        requester.id !== form.user_id ||
                        c.id === form.user_id
                      ) {
                        redirect("/dashboard");
                      }

                      await admin
                        .from("form_members")
                        .delete()
                        .eq("form_id", data.id)
                        .eq("user_id", c.id);

                      // Force UI refresh
                      redirect(`/create/${slug}`);
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="submit"
                          className="cursor-pointer text-neutral-300 hover:text-neutral-400"
                        >
                          <CircleMinus size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="font-bold">
                        Remove
                      </TooltipContent>
                    </Tooltip>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Editor */}
      <div className="flex-1">
        <FormEditorClient
          initialForm={data.schema}
          formId={data.id}
          isOwner={user?.id === formOwnerId}
        />
      </div>
    </div>
  );
}
