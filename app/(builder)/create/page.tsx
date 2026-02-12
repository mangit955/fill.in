import { createEmptyForm } from "@/lib/forms/defaults";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const supabase = await createServerSupabase();
  const form = createEmptyForm();

  const { error } = await supabase.from("forms").insert({
    id: form.id,
    slug: form.slug,
    title: form.title,
    description: form.description,
    status: "draft",
    schema: form,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to create form");
  }

  redirect(`/create/${form.slug}`);
}
