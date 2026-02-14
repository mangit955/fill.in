import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Form } from "@/lib/forms/types";
import { FormBlock } from "@/lib/forms/types";
import { NavbarHome } from "@/components/navbar/navbarHome";

type ResponseRow = {
  id: string;
  created_at: string;
  answers: Record<string, unknown>;
};

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
    .select("id, schema, title")
    .eq("slug", slug)
    .single();

  if (!formRow || formError) {
    notFound();
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

  return (
    <div>
      <NavbarHome />
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-6">
          Responses ({allResponses.length})
        </h1>

        {/* Empty state */}
        {allResponses.length === 0 && (
          <div className="text-muted-foreground text-sm">No responses yet</div>
        )}

        {/* Table */}
        {allResponses.length > 0 && (
          <div className="border rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2">Time</th>

                  {(form.blocks as FormBlock[]).map((block) => (
                    <th key={block.id} className="text-left px-3 py-2">
                      {block.config?.label || "Question"}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {allResponses.map((response) => (
                  <tr key={response.id} className="border-t">
                    {/* Time */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(response.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>

                    {/* Answers */}
                    {(form.blocks as FormBlock[]).map((block) => {
                      // answers might be stored with prefixed ids like "multiple_choice_<id>"
                      let value = response.answers?.[block.id];

                      if (value === undefined) {
                        const prefixedKey = `${block.type}_${block.id}`;
                        value = response.answers?.[prefixedKey];
                      }

                      let display = "—";

                      const options =
                        block.type === "multiple_choice"
                          ? block.config.options
                          : [];

                      // MULTI‑SELECT (array of ids)
                      if (Array.isArray(value)) {
                        const labels = value.map((optionId: string) => {
                          const byId = options.find((o) => o.id === optionId);
                          if (byId) return byId.label ?? optionId;

                          // backward compatibility for legacy saved answers that stored label directly
                          const byLabel = options.find(
                            (o) => o.label === optionId,
                          );
                          if (byLabel) return byLabel.label;

                          return optionId;
                        });

                        display = labels.join(", ");
                      }
                      // SINGLE‑SELECT (string id)
                      else if (typeof value === "string") {
                        const byId = options.find((o) => o.id === value);
                        if (byId) display = byId.label ?? value;
                        else {
                          const byLabel = options.find((o) => o.label === value);
                          if (byLabel) display = byLabel.label;
                          else display = value;
                        }
                      }
                      // TEXT ANSWERS
                      else if (value !== undefined && value !== null) {
                        display = String(value);
                      }

                      return (
                        <td key={block.id} className="px-3 py-2">
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
