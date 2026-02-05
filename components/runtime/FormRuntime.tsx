"use client";

import { useEffect, useState } from "react";
import { Form } from "@/lib/forms/types";
import { getNextBlockId } from "@/lib/forms/evaluate";
import { isBlockVisible } from "@/lib/forms/visibility";

type Props = {
  form: Form;
};

export default function FormRuntime({ form }: Props) {
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(
    form.blocks[0]?.id ?? null
  );

  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  // Skip hidden blocks automatically
  useEffect(() => {
    if (!currentBlockId) return;

    const visible = isBlockVisible(currentBlockId, answers, form);
    if (!visible) {
      const next = getNextBlockId(currentBlockId, answers, form);
      setCurrentBlockId(next);
    }
  }, [currentBlockId, answers, form]);

  if (!currentBlockId) {
    return <div className="text-center py-10">Form completed</div>;
  }

  const block = form.blocks.find((b) => b.id === currentBlockId);
  if (!block) return <div>Invalid block</div>;

  function submitAnswer(value: unknown) {
    const nextAnswers = {
      ...answers,
      [currentBlockId!]: value,
    };

    const next = getNextBlockId(currentBlockId!, nextAnswers, form);

    setAnswers(nextAnswers);
    setCurrentBlockId(next);
  }

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <div className="text-lg font-medium">{block.config.label}</div>

      {/* Placeholder answer button */}
      {block.type === "short_text" && (
        <input
          className="w-full border rounded px-3 py-2"
          value={(answers[block.id] as string) ?? ""}
          onChange={(e) =>
            setAnswers({ ...answers, [block.id]: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitAnswer(e.currentTarget.value);
            }
          }}
        />
      )}

      {block.type === "long_text" && (
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={block.config.rows}
          value={(answers[block.id] as string) ?? ""}
          onChange={(e) =>
            setAnswers({ ...answers, [block.id]: e.target.value })
          }
        />
      )}

      {block.type === "multiple_choice" && (
        <div className="space-y-2">
          {block.config.options.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2">
              <input
                type={block.config.allowMultiple ? "checkbox" : "radio"}
                name={block.id}
                value={opt.id}
                checked={
                  block.config.allowMultiple
                    ? (answers[block.id] as string[])?.includes(opt.id)
                    : answers[block.id] === opt.id
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
              className="px-4 py-2 border rounded cursor-pointer"
              onClick={() => submitAnswer(answers[block.id])}
            >
              Next
            </button>
          )}
        </div>
      )}

      {block.type === "long_text" && (
        <button
          className="px-4 py-2 border rounded cursor-pointer"
          onClick={() => submitAnswer(answers[block.id])}
        >
          Next
        </button>
      )}
    </div>
  );
}
