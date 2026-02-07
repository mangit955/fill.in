"use client";

import { useEffect, useState } from "react";
import { Form } from "@/lib/forms/types";
import { getNextBlockId } from "@/lib/forms/evaluate";
import { isBlockVisible } from "@/lib/forms/visibility";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import successAnimation from "@/public/lottie/Success.json";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import TooltipHint from "../ui/toolTipHint";

type Props = {
  form: Form;
  preview?: boolean;
};

export default function FormRuntime({ form, preview }: Props) {
  const router = useRouter();
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(
    form.blocks[0]?.id ?? null
  );
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset runtime when preview opens so it always starts from first block
  useEffect(() => {
    if (preview) {
      setCurrentBlockId(form.blocks[0]?.id ?? null);
      setAnswers({});
    }
  }, [preview, form.id, form.blocks]);

  // Skip hidden blocks automatically
  useEffect(() => {
    if (!currentBlockId) return;

    // 🔑 Prevent preview from skipping first question on mount
    if (preview && Object.keys(answers).length === 0) return;

    const visible = isBlockVisible(currentBlockId, answers, form);
    if (!visible) {
      const next = getNextBlockId(currentBlockId, answers, form);
      setCurrentBlockId(next);
    }
  }, [currentBlockId, answers, form, preview]);

  // Preview with no questions: show empty state only
  if (preview && form.blocks.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-center">
        <p className="text-lg text-neutral-600">
          Add at least one question to your form to see the preview.
        </p>
      </div>
    );
  }

  if (!currentBlockId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-center">
        <div className="space-y-2">
          <div className="flex justify-center">
            <Lottie
              animationData={successAnimation}
              loop={false}
              className="w-20 h-20"
            />
          </div>
          <h1 className="text-2xl font-semibold ">
            Thanks for completing this form!
          </h1>
          <h2 className="text-md text-neutral-500 pb-8">
            Made with Fill.in, the simplest way to create forms for free.
          </h2>
          <button
            onClick={() => {
              if (!preview) router.push("/create");
            }}
            className="border hover:outline  text-lg rounded-md px-2 py-1 font-medium text-blue-600 hover:text-blue-500 hover:shadow-md cursor-pointer"
          >
            Create your own form
          </button>
        </div>
      </div>
    );
  }

  const foundBlock = form.blocks.find((b) => b.id === currentBlockId);
  if (!foundBlock) return <div>Invalid block</div>;
  const block = foundBlock;

  async function submitForm(finalAnswers: Record<string, unknown>) {
    if (preview) {
      setCurrentBlockId(null);
      setAnswers({});
      return;
    }

    const filtered: Record<string, unknown> = {};

    if (submitting) return;
    setSubmitting(true);

    for (const block of form.blocks) {
      if (!isBlockVisible(block.id, finalAnswers, form)) continue;
      if (finalAnswers[block.id] === undefined) continue;

      filtered[block.id] = finalAnswers[block.id];
    }

    const { error } = await supabase.from("responses").insert({
      form_id: form.id,
      answers: filtered,
    });

    if (error) {
      console.error("Submit failed:", error);
      alert("Submission failed. Please try again.");
      setSubmitting(false);
      return;
    }
  }

  async function submitAnswer(value: unknown) {
    if (submitting) return;

    const nextAnswers = {
      ...answers,
      [currentBlockId!]: value,
    };

    const next = getNextBlockId(currentBlockId!, nextAnswers, form);

    const isEmpty =
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (block.required && isEmpty) {
      alert("This question is required");
      return;
    }

    if (block.required) {
      const isEmptyString =
        typeof value === "string" && value.trim().length === 0;
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isNullish = value === null || value === undefined;

      if (isNullish || isEmptyString || isEmptyArray) {
        return;
      }
    }

    if (!next) {
      await submitForm(nextAnswers);
      setCurrentBlockId(null);
      setAnswers({});
      return;
    }

    setAnswers(nextAnswers);
    setCurrentBlockId(next);
  }

  const selected = (answers[block.id] as string[]) ?? [];

  return (
    <div className="min-h-screen w-full relative ">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 pointer-events-none">
        <h1 className="text-5xl text-neutral-700 font-bold text-left">
          {form.title}
        </h1>
      </div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl space-y-6 px-4 ${preview ? "pointer-events-none select-none" : ""}`}
      >
        <div className="text-xl font-semibold mt-4 flex items-center gap-1">
          {block.config.label}
          {block.required && (
            <TooltipHint label="Required">
              <span className="text-gray-700 text-3xl leading-none cursor-pointer">
                *
              </span>
            </TooltipHint>
          )}
        </div>

        {/* Placeholder answer button */}
        {block.type === "short_text" && (
          <input
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            value={(answers[block.id] as string) ?? ""}
            onChange={(e) =>
              setAnswers({ ...answers, [block.id]: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitAnswer(e.currentTarget.value);
              }
            }}
          />
        )}

        {block.type === "long_text" && (
          <textarea
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            rows={block.config.rows}
            value={(answers[block.id] as string) ?? ""}
            onChange={(e) =>
              setAnswers({ ...answers, [block.id]: e.target.value })
            }
          />
        )}

        {block.type === "multiple_choice" && (
          <div className="space-y-2 ">
            {block.config.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2">
                <input
                  type={block.config.allowMultiple ? "checkbox" : "radio"}
                  name={block.id}
                  value={opt.id}
                  className="cursor-pointer"
                  checked={
                    block.config.allowMultiple
                      ? selected.includes(opt.id)
                      : (answers[block.id] ?? "") === opt.id
                  }
                  onChange={(e) => {
                    if (block.config.allowMultiple) {
                      const prev = (answers[block.id] as string[]) ?? [];
                      const next = e.target.checked
                        ? [...prev, opt.id]
                        : prev.filter((id) => id !== opt.id);

                      setAnswers({ ...answers, [block.id]: next });
                    } else {
                      submitAnswer(opt.id);
                    }
                  }}
                />
                {opt.label}
              </label>
            ))}

            {block.config.allowMultiple && (
              <button
                className="px-2 py-1 border bg-black text-white rounded-md cursor-pointer font-semibold"
                onClick={() => submitAnswer(answers[block.id])}
              >
                Next →
              </button>
            )}
          </div>
        )}

        {block.type === "long_text" && (
          <button
            className="px-2 py-1 border bg-black text-white hover:bg-neutral-700 rounded-md  cursor-pointer font-semibold"
            onClick={() => submitAnswer(answers[block.id])}
          >
            Next →
          </button>
        )}
        {block.type === "short_text" && (
          <button
            className="px-2 py-1 border bg-black text-white hover:bg-neutral-700 rounded-md  cursor-pointer font-semibold"
            onClick={() => submitAnswer(answers[block.id])}
          >
            Next →
          </button>
        )}
      </div>
      <Link href={"/"} className={preview ? "pointer-events-none" : ""}>
        <button className="border border-gray-300 hover:ring-1 hover:ring-gray-300 rounded-md px-2 py-1 text-blue-600 font-semibold cursor-pointer hover:shadow-md hover:text-blue-500 bottom-4 right-4 fixed">
          Made with Fill.in
        </button>
      </Link>
    </div>
  );
}
