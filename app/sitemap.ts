import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fill-in-ten.vercel.app"
).replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return staticPages;
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: forms } = await admin
    .from("forms")
    .select("slug, updated_at")
    .eq("status", "published");

  const runtimePages: MetadataRoute.Sitemap =
    forms?.map((form) => ({
      url: `${siteUrl}/f/${form.slug}`,
      lastModified: form.updated_at ? new Date(form.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })) ?? [];

  return [...staticPages, ...runtimePages];
}
