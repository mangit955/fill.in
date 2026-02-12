import { createEmptyForm } from "@/lib/forms/defaults";
import { createServerSupabase } from "@/lib/supabase/server";
import NextLink from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavbarHome } from "@/components/navbar/navbarHome";
import { PencilLine, Plus } from "lucide-react";
import CopyLinkButton from "./CopyLinkButton";
import DeleteFormButton from "./DeleteFormButton";
import EmptyFormsAnimation from "./emptyAnimation";

function formatRelative(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (day > 0) return `Created ${day} day${day > 1 ? "s" : ""} ago`;
  if (hr > 0) return `Created ${hr} hour${hr > 1 ? "s" : ""} ago`;
  if (min > 0) return `Created ${min} min${min > 1 ? "s" : ""} ago`;
  return "Created just now";
}

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const { data: forms } = await supabase
    .from("forms")
    .select("id, title, slug, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const formsWithCounts = [];

  if (!forms) return null;

  for (const form of forms ?? []) {
    const { count } = await supabase
      .from("responses")
      .select("id", { count: "exact", head: true })
      .eq("form_id", form.id);

    formsWithCounts.push({
      ...form,
      responseCount: count ?? 0,
    });
  }

  async function createForm() {
    "use server";

    const supabase = await createServerSupabase();
    const form = createEmptyForm();

    await supabase.from("forms").insert({
      id: form.id,
      slug: form.slug,
      title: form.title,
      description: form.description,
      schema: form,
      status: "draft",
    });

    revalidatePath("/dashboard");

    redirect(`/create/${form.slug}`);
  }

  async function deleteForm(formData: FormData) {
    "use server";

    const formId = formData.get("formId") as string;
    if (!formId) return;

    const supabase = await createServerSupabase();

    await supabase.from("responses").delete().eq("form_id", formId);
    await supabase.from("forms").delete().eq("id", formId);

    revalidatePath("/dashboard");
  }

  if (formsWithCounts.length === 0) {
    return (
      <div>
        <NavbarHome />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <EmptyFormsAnimation />
          <span className="text-xl text-neutral-700 font-bold">
            No forms yet
          </span>
          <span className="text-neutral-500 mb-4 mt-2 max-w-md">
            Roll up your sleeves and let’s get started. It's as simple as
            one-two-three.
          </span>
          <form action={createForm}>
            <Button variant="default">
              {" "}
              <Plus width={20} height={20} className="mr-2" /> New form
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarHome />
      <div className="max-w-4xl mx-auto py-10 px-4  space-y-6">
        <div className="flex items-center justify-between border-b pt-18 pb-4">
          <h1 className="text-3xl text-neutral-800 font-bold">Home</h1>

          <form action={createForm}>
            <Button variant="default">
              {" "}
              <Plus width={20} height={20} className="mr-2" /> New form
            </Button>
          </form>
        </div>

        {formsWithCounts.map((form) => (
          <div
            key={form.id}
            className="group relative rounded-md hover:bg-gray-100 p-4 flex justify-between items-center"
          >
            {/* Left side (clickable to responses) */}
            <NextLink
              href={`/create/${form.slug}/responses`}
              className="flex-1 cursor-pointer"
            >
              <div>
                <div className="font-medium">{form.title}</div>
                <div className="text-sm text-neutral-500 flex items-center gap-2">
                  <span>{form.responseCount} Submissions</span>
                  <span className="text-neutral-400">•</span>
                  <span className="capitalize">{form.status}</span>
                  <span className="text-neutral-400">•</span>
                  <span>{formatRelative(form.created_at)}</span>
                </div>
              </div>
            </NextLink>

            {/* Action buttons */}
            <div className="flex items-center gap-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <NextLink
                href={`/create/${form.slug}`}
                className="flex focus:outline-none
focus-visible:ring-4 focus-visible:ring-blue-200
active:ring-4 active:ring-blue-200 items-center gap-1 cursor-pointer text-neutral-500 hover:text-neutral-600 font-semibold hover:bg-gray-200 p-1 rounded-md"
              >
                <PencilLine size={16} className="mr-1" />
                <span>Edit</span>
              </NextLink>

              <CopyLinkButton slug={form.slug} />

              <form action={deleteForm}>
                <input type="hidden" name="formId" value={form.id} />
                <DeleteFormButton />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
