import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createServerSupabase();

  // Fetch form
  const { data: formRow, error: formError } = await supabase
    .from("forms")
    .select("id, schema, title")
    .eq("slug", slug)
    .single();

  if (!formRow || formError) {
    notFound();
  }

  const form = formRow.schema;
  const formId = formRow.id;

  // Fetch responses
  const { data: responses } = await supabase
    .from("responses")
    .select("*")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  const allResponses = responses ?? [];

  return (
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

                {form.blocks.map((block: any) => (
                  <th key={block.id} className="text-left px-3 py-2">
                    {block.config?.label || "Question"}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allResponses.map((response: any) => (
                <tr key={response.id} className="border-t">
                  {/* Time */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(response.created_at).toLocaleString()}
                  </td>

                  {/* Answers */}
                  {form.blocks.map((block: any) => {
                    // answers might be stored with prefixed ids like "multiple_choice_<id>"
                    let value = response.answers?.[block.id];

                    if (value === undefined) {
                      const prefixedKey = `${block.type}_${block.id}`;
                      value = response.answers?.[prefixedKey];
                    }

                    let display = "—";

                    const options = block.config?.options ?? [];

                    // MULTI‑SELECT (array of ids)
                    if (Array.isArray(value)) {
                      const labels = value.map((optionId: string) => {
                        const obj = options.find((o: any) => o.id === optionId);
                        if (obj) return obj.label ?? obj.value ?? optionId;

                        const objByValue = options.find(
                          (o: any) => o.value === optionId
                        );
                        if (objByValue) return objByValue.label ?? optionId;

                        const str = options.find((o: any) => o === optionId);
                        if (str) return str;

                        return optionId;
                      });

                      display = labels.join(", ");
                    }
                    // SINGLE‑SELECT (string id)
                    else if (typeof value === "string") {
                      const obj = options.find((o: any) => o.id === value);
                      if (obj) display = obj.label ?? obj.value ?? value;
                      else {
                        const objByValue = options.find(
                          (o: any) => o.value === value
                        );
                        if (objByValue) display = objByValue.label ?? value;
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
  );
}
