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
import { FillinLogo } from "../ui/svg/logo";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "../ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

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
  const [history, setHistory] = useState<string[]>([]);
  const [showRequiredAlert, setShowRequiredAlert] = useState(false);

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
        <p className="text-lg font-semibold text-neutral-600">
          + Add at least one question to your form to see the preview.
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
            className="mx-auto border flex gap-2 items-center hover:outline text-lg rounded-md px-2 py-1 font-medium text-blue-600 hover:text-blue-500 hover:shadow-md cursor-pointer"
          >
            <FillinLogo size={18} />
            <span>Create your own form</span>
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

    // EMAIL VALIDATION (stronger)
    if (block.type === "email") {
      const email = String(value ?? "")
        .trim()
        .toLowerCase();

      // allow skip if optional and empty
      if (!block.required && email.length === 0) {
        // skip validation
      } else {
        // stricter RFC-style check
        const strictEmailRegex =
          /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

        if (!strictEmailRegex.test(email)) {
          toast.error("Enter a valid email address");
          return;
        }

        // prevent obvious fake domains
        const blockedDomains = ["test.com", "example.com", "mailinator.com"];
        const domain = email.split("@")[1];

        if (blockedDomains.includes(domain)) {
          toast.warning("Please use a real email address");
          return;
        }
      }
    }

    // PHONE VALIDATION (strict)
    if (block.type === "phone") {
      const raw = String(value ?? "").trim();

      // allow skip if optional and empty
      if (!block.required && raw.length === 0) {
        // skip validation
      } else {
        // must be digits only (you already strip non-digits in input)
        const digitsOnly = raw.replace(/\D/g, "");

        // length rules: 7–15 digits (international safe range)
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
          toast.warning("Enter a valid phone number");
          return;
        }

        // prevent obviously fake numbers like all same digit
        if (/^(\d)\1+$/.test(digitsOnly)) {
          toast.warning("Enter a real phone number");
          return;
        }
      }
    }

    const next = getNextBlockId(currentBlockId!, nextAnswers, form);

    const isEmpty =
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (block.required && isEmpty) {
      setShowRequiredAlert(true);
      return;
    }

    if (!next) {
      await submitForm(nextAnswers);
      setCurrentBlockId(null);
      setAnswers({});
      return;
    }

    setHistory((h) => [...h, currentBlockId!]);
    setCurrentBlockId(next);
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentBlockId(prev);
  }

  const rawValue = answers[block.id];

  const selectedArray: string[] = Array.isArray(rawValue) ? rawValue : [];
  const selectedSingle: string | undefined =
    typeof rawValue === "string" ? rawValue : undefined;

  return (
    <div className="min-h-screen w-full relative mb-8 ">
      <div className="w-full max-w-xl mx-auto px-4 pt-16">
        <h1 className="text-5xl text-neutral-700 font-bold text-left">
          {form.title}
        </h1>
        {form.description && (
          <h2 className="text-md text-neutral-700  text-left mt-6 leading-relaxed">
            {form.description}
          </h2>
        )}
      </div>
      <div
        className={`w-full max-w-xl mx-auto space-y-6 px-4 mt-12 ${
          preview ? "pointer-events-none select-none" : ""
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <div className="text-xl font-semibold mt-4 mb-4 flex items-center gap-1">
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
              <>
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
                {(() => {
                  const nextId = getNextBlockId(currentBlockId!, answers, form);
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2 cursor-pointer font-bold hover:bg-neutral-100  py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold  disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[100px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "long_text" && (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 "
                  rows={block.config.rows}
                  value={(answers[block.id] as string) ?? ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [block.id]: e.target.value })
                  }
                />
                {(() => {
                  const nextId = getNextBlockId(currentBlockId!, answers, form);
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2 cursor-pointer font-bold hover:bg-neutral-100  py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold  disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[100px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "email" && (
              <>
                <input
                  type="email"
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
                  placeholder="Enter your email"
                />
                {(() => {
                  const nextId = getNextBlockId(currentBlockId!, answers, form);
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2 cursor-pointer font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold  disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[100px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "phone" && (
              <>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  value={(answers[block.id] as string) ?? ""}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setAnswers({ ...answers, [block.id]: onlyDigits });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitAnswer(e.currentTarget.value);
                    }
                  }}
                  placeholder="Enter your phone number"
                />

                {(() => {
                  const nextId = getNextBlockId(currentBlockId!, answers, form);
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2 cursor-pointer font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[100px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "multiple_choice" && (
              <div className="space-y-2 ">
                {block.config.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type={block.config.allowMultiple ? "checkbox" : "radio"}
                      name={block.id}
                      value={opt.id}
                      className="cursor-pointer"
                      checked={
                        block.config.allowMultiple
                          ? selectedArray.includes(opt.id)
                          : selectedSingle === opt.id
                      }
                      onChange={(e) => {
                        if (block.config.allowMultiple) {
                          const prev = (answers[block.id] as string[]) ?? [];
                          const next = e.target.checked
                            ? [...prev, opt.id]
                            : prev.filter((id) => id !== opt.id);

                          setAnswers({ ...answers, [block.id]: next });
                        } else {
                          setAnswers({ ...answers, [block.id]: opt.id });
                        }
                      }}
                    />
                    <span className="select-none">{opt.label}</span>
                  </div>
                ))}

                {(() => {
                  const nextId = getNextBlockId(currentBlockId!, answers, form);
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2 cursor-pointer font-bold hover:bg-neutral-100  py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        disabled={
                          submitting ||
                          (block.required && answers[block.id] === undefined)
                        }
                        className={`px-2 py-1 border min-w-[100px] text-white rounded-md font-semibold cursor-pointer disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[100px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <Link href={"/"} className={preview ? "pointer-events-none" : ""}>
        <button className="border backdrop-blur border-gray-300 hover:ring-1 hover:ring-gray-300 rounded-md px-3 py-1 text-blue-600 font-semibold cursor-pointer hover:shadow-md hover:text-blue-500 bottom-4 right-4 fixed flex items-center gap-2">
          <span>Made with Fill.in</span>
          <FillinLogo size={18} />
        </button>
      </Link>

      {/* Required field alert */}
      <AlertDialog open={showRequiredAlert} onOpenChange={setShowRequiredAlert}>
        <AlertDialogOverlay className="bg-black/10 backdrop-blur" />
        <AlertDialogContent className="border shadow-lg">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <TriangleAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>This question is required !</AlertDialogTitle>
            <AlertDialogDescription>
              Please answer it before Proceding further.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => setShowRequiredAlert(false)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
