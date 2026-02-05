import FormRuntime from "@/components/runtime/FormRuntime";
import { supabase } from "@/lib/supabase/client";

export default async function RuntimePage({
  params,
}: {
  params: { slug: string };
}) {
  const { data, error } = await supabase
    .from("forms")
    .select("schema")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return <div>Form not found</div>;
  }

  const form = data.schema;

  return <FormRuntime form={form} />;
}
