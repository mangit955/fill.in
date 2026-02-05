import { createServerSupabase } from "@/lib/supabase/server";
import FormRuntime from "@/components/runtime/FormRuntime";

export default async function RuntimePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("forms")
    .select("schema, status")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return <div>Form not published</div>;

  return <FormRuntime form={data.schema} />;
}
