import { createServerSupabase } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Form } from "@/lib/forms/types";
import { NavbarHome } from "@/components/navbar/navbarHome";
import ResponsesDataTable, { ResponseRow } from "./ResponsesDataTable";
import AnalyticsDrawer from "./AnalyticsDrawer";

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
  const viewedByBlock: Record<string, Set<string>> = {};

  events?.forEach(
    (e: {
      event_type: string;
      session_id: string | null;
      block_id: string | null;
    }) => {
      if (!e.session_id) return;

      if (e.event_type === "view") {
        viewSessions.add(e.session_id);
        if (e.block_id) {
          if (!viewedByBlock[e.block_id]) {
            viewedByBlock[e.block_id] = new Set<string>();
          }
          viewedByBlock[e.block_id].add(e.session_id);
        }
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
  // Fallback for environments where form_events insert/select is blocked by RLS:
  // use responses count so analytics don't show 0 when submissions exist.
  const submits =
    submitSessions.size > 0 ? submitSessions.size : allResponses.length;
  const effectiveViews = views > 0 ? views : submits;
  const completionRate = effectiveViews
    ? Math.min(100, Math.round((submits / effectiveViews) * 100))
    : 0;

  // True funnel drop-off: reached question - answered question.
  const dropOffMap: Record<string, number> = {};
  form.blocks.forEach((block, index) => {
    const answered = answeredByBlock[block.id]?.size ?? 0;
    const reachedFromViews = viewedByBlock[block.id]?.size ?? 0;
    const reachedFallback =
      index === 0
        ? effectiveViews
        : (answeredByBlock[form.blocks[index - 1].id]?.size ?? 0);
    const reached = reachedFromViews > 0 ? reachedFromViews : reachedFallback;
    dropOffMap[block.id] = Math.max(reached - answered, 0);
  });
  const dropOffItems = form.blocks.map((b) => ({
    id: b.id,
    label: b.config?.label || "Question",
    count: dropOffMap[b.id] || 0,
  }));

  return (
    <div className="min-h-screen">
      <NavbarHome />
      <div className="max-w-7xl mx-auto pt-24 pb-14 px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h1 className="text-3xl font-semibold">Responses</h1>

          <AnalyticsDrawer
            effectiveViews={effectiveViews}
            submits={submits}
            completionRate={completionRate}
            dropOffItems={dropOffItems}
          />
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
