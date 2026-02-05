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

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <div className="text-lg font-medium">{block.config.label}</div>

      {/* Placeholder answer button */}
      <button
        className="px-4 py-2 border rounded"
        onClick={() => {
          const nextAnswers = {
            ...answers,
            [currentBlockId]: true,
          };
          const next = getNextBlockId(currentBlockId, nextAnswers, form);
          setAnswers(nextAnswers);
          setCurrentBlockId(next);
        }}
      >
        Next
      </button>
    </div>
  );
}
