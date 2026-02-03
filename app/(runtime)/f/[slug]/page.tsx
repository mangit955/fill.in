"use client";

import { useEffect, useState } from "react";
import { getNextBlockId } from "@/lib/forms/evaluate";
import { isBlockVisible } from "@/lib/forms/visibility";
import { createShortTextBlock } from "@/lib/forms/defaults";
import { Form } from "@/lib/forms/types";

const a = createShortTextBlock();
const b = createShortTextBlock();
const c = createShortTextBlock();

a.id = "a";
b.id = "b";
c.id = "c";

const form: Form = {
  id: "test",
  title: "Test form",
  description: "Runtime test",
  blocks: [a, b, c],
  logicJumps: [
    {
      id: "j1",
      fromBlockId: "a",
      order: 2,
      condition: {
        blockId: "a",
        operator: "equals",
        value: "yes",
      },
      toBlockId: "c",
    },
  ],
  visibilityRules: [],
};

export default function RuntimePage() {
  const [currentBlockId, setCurrentBlockId] = useState<string | null>("a");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [answer, setAnswer] = useState("");

  const currentBlock = form.blocks.find((b) => b.id === currentBlockId);

  function handleNext() {
    if (!currentBlockId) return;
    const nextAnswer = {
      ...answers,
      [currentBlockId]: answer,
    };

    const nextId = getNextBlockId(currentBlockId, nextAnswer, form);

    setAnswers(nextAnswer);
    setAnswer("");
    setCurrentBlockId(nextId);
  }

  useEffect(() => {
    if (!currentBlockId) return;

    const visible = isBlockVisible(currentBlockId, answers, form);

    if (!visible) {
      const next = getNextBlockId(currentBlockId, answers, form);
      setCurrentBlockId(next);
    }
  }, [currentBlockId, answers]);

  if (!currentBlock) {
    return <div>Form complete</div>;
  }

  return (
    <div>
      <h1>{currentBlock.config.label}</h1>

      <input value={answer} onChange={(e) => setAnswer(e.target.value)} />

      <button onClick={handleNext}>Next</button>
    </div>
  );
}
