import FormEditorClient from "@/lib/editor/FormEditorClient";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("forms")
    .select("schema")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.log("DB error:", error);
    return <div>Form not found</div>;
  }

  const form = data.schema;

  return <FormEditorClient initialForm={form} />;
}
