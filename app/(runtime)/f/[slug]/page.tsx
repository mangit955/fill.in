import { createServerSupabase } from "@/lib/supabase/server";
import FormRuntime from "@/components/runtime/FormRuntime";
import type { Metadata } from "next";
import type { Form } from "@/lib/forms/types";

type RuntimeParams = {
  params: Promise<{ slug: string }>;
};

async function getPublishedForm(slug: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("forms")
    .select("id, schema, status")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: RuntimeParams): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedForm(slug);

  if (!data) {
    return {
      title: "Form not found | Fill.in",
      description: "This form is not available.",
    };
  }

  const schema = data.schema as Form;
  const title = schema.title?.trim() || "Untitled form";
  const description =
    schema.description?.trim() || "Fill out this form on Fill.in.";
  const url = `/f/${slug}`;

  return {
    title: `${title} | Fill.in`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ["/og1.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og1.png"],
    },
  };
}

export default async function RuntimePage({ params }: RuntimeParams) {
  const { slug } = await params;
  const data = await getPublishedForm(slug);

  if (!data) return <div>Form not published</div>;

  return <FormRuntime form={data.schema} formId={data.id} />;
}
