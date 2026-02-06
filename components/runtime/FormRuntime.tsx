"use client";

import { useEffect, useState } from "react";
import { Form } from "@/lib/forms/types";
import { getNextBlockId } from "@/lib/forms/evaluate";
import { isBlockVisible } from "@/lib/forms/visibility";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import successAnimation from "@/public/lottie/Success.json";

type Props = {
  form: Form;
};

export default function FormRuntime({ form }: Props) {
  const router = useRouter();
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
            onClick={() => router.push("/create")}
            className="border hover:outline  text-lg rounded-md px-2 py-1 font-medium text-blue-600 hover:text-blue-500 hover:shadow-md cursor-pointer"
          >
            Create your own form
          </button>
        </div>
      </div>
    );
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

  const selected = (answers[block.id] as string[]) ?? [];

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-xl font-semibold">{block.config.label}</div>

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
          <div className="space-y-2">
            {block.config.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2">
                <input
                  type={block.config.allowMultiple ? "checkbox" : "radio"}
                  name={block.id}
                  value={opt.id}
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
                className="px-2 py-1 border bg-black text-white rounded-md cursor-pointer"
                onClick={() => submitAnswer(answers[block.id])}
              >
                Next →
              </button>
            )}
          </div>
        )}

        {block.type === "long_text" && (
          <button
            className="px-2 py-1 border bg-black text-white hover:bg-neutral-700 rounded-md  cursor-pointer"
            onClick={() => submitAnswer(answers[block.id])}
          >
            Next →
          </button>
        )}
        {block.type === "short_text" && (
          <button
            className="px-2 py-1 border bg-black text-white hover:bg-neutral-700 rounded-md  cursor-pointer"
            onClick={() => submitAnswer(answers[block.id])}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
