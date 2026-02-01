"use client";

import { useState } from "react";
import { getNextBlockId } from "@/lib/forms/evaluate";

const form = {
  id: "test",
  blocks: [
    { id: "a", type: "short_text", required: false, config: { label: "A" } },
    { id: "b", type: "short_text", required: false, config: { label: "B" } },
    { id: "c", type: "short_text", required: false, config: { label: "C" } },
  ],
  logicJumps: [
    {
      id: "j1",
      fromBlockId: "a",
      condition: {
        blockId: "a",
        operator: "equals",
        value: "yes",
      },
      toBlockId: "c",
    },
  ],
};

export default function RuntimePage() {
  const [currentBlockId, setCurrentBlockId] = useState("a");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [answer, setAnswer] = useState("");

  const currentBlock = form.blocks.find((b) => b.id === currentBlockId);

  function handleNext() {
    const nextAnswer = {
      ...answers,
      [currentBlockId]: answer,
    };

    const nextId = getNextBlockId(currentBlockId, nextAnswer, form);

    setAnswers(nextAnswer);
    setAnswer("");
    setCurrentBlockId(nextId);
  }

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
