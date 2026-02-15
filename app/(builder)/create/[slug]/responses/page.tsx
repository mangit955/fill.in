import { createServerSupabase } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Form } from "@/lib/forms/types";
import { NavbarHome } from "@/components/navbar/navbarHome";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ResponsesDataTable, { ResponseRow } from "./ResponsesDataTable";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createServerSupabase();

  // Fetch form
  const { data: formRow, error: formError } = await supabase
    .from("forms")
    .select("id, schema, title, user_id")
    .eq("slug", slug)
    .single();

  if (!formRow || formError) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const isOwner = formRow.user_id === user.id;
  let isMember = false;

  if (!isOwner) {
    // If form has no owner, deny access to responses.
    if (!formRow.user_id) {
      redirect("/dashboard");
    }

    const { data: member } = await supabase
      .from("form_members")
      .select("id")
      .eq("form_id", formRow.id)
      .eq("user_id", user.id)
      .maybeSingle();

    isMember = !!member;
  }

  if (!isOwner && !isMember) {
    redirect("/dashboard");
  }

  const form = formRow.schema as Form;
  const formId = formRow.id;

  // Fetch responses
  const { data: responses } = await supabase
    .from("responses")
    .select("id, created_at, answers")
    .eq("form_id", formId)
    .order("created_at", { ascending: false })
    .limit(100);

  const allResponses: ResponseRow[] = responses ?? [];

  // --- ANALYTICS (unique-session based) ---
  const { data: events } = await supabase
    .from("form_events")
    .select("event_type, session_id, block_id")
    .eq("form_id", formId);

  const viewSessions = new Set<string>();
  const submitSessions = new Set<string>();
  const answeredByBlock: Record<string, Set<string>> = {};

  events?.forEach(
    (e: {
      event_type: string;
      session_id: string | null;
      block_id: string | null;
    }) => {
      if (!e.session_id) return;

      if (e.event_type === "view") {
        viewSessions.add(e.session_id);
      }

      if (e.event_type === "submit") {
        submitSessions.add(e.session_id);
      }

      if (e.event_type === "answer" && e.block_id) {
        if (!answeredByBlock[e.block_id]) {
          answeredByBlock[e.block_id] = new Set<string>();
        }
        answeredByBlock[e.block_id].add(e.session_id);
      }
    },
  );

  const views = viewSessions.size;
  const submits = submitSessions.size;
  const completionRate = views ? Math.round((submits / views) * 100) : 0;

  // True funnel drop-off: reached question - answered question.
  const dropOffMap: Record<string, number> = {};
  form.blocks.forEach((block, index) => {
    const answered = answeredByBlock[block.id]?.size ?? 0;
    const reached =
      index === 0
        ? views
        : (answeredByBlock[form.blocks[index - 1].id]?.size ?? 0);
    dropOffMap[block.id] = Math.max(reached - answered, 0);
  });

  return (
    <div className="min-h-screen">
      <NavbarHome />
      <div className="max-w-7xl mx-auto pt-24 pb-14 px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h1 className="text-3xl font-semibold">Responses</h1>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">View analytics</Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Form analytics</DrawerTitle>
              </DrawerHeader>

              <div className="px-6 pb-10 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg border-gray-300 shadow-sm p-4">
                    <div className="text-sm text-muted-foreground">Views</div>
                    <div className="text-2xl font-semibold">{views ?? 0}</div>
                  </div>

                  <div className="border rounded-lg border-gray-300 shadow-sm p-4">
                    <div className="text-sm text-muted-foreground">Submits</div>
                    <div className="text-2xl font-semibold">{submits ?? 0}</div>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-muted-foreground">
                      Completion
                    </div>
                    <div className="text-2xl font-semibold">
                      {completionRate}%
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Drop‑off by question</h3>
                  <div className="space-y-2">
                    {form.blocks.map((b) => {
                      const count = dropOffMap[b.id] || 0;
                      return (
                        <div
                          key={b.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {b.config?.label || "Question"}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Empty state */}
        {allResponses.length === 0 && (
          <div className="text-muted-foreground text-sm">No responses yet</div>
        )}

        {/* Table */}
        {allResponses.length > 0 && (
          <ResponsesDataTable rows={allResponses} blocks={form.blocks} />
        )}
      </div>
    </div>
  );
}
