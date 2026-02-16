"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  ChevronDownIcon,
  Star,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { isValidUrl } from "@/lib/forms/helpers";
import Image from "next/image";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

type Props = {
  form: Form;
  formId?: string;
  preview?: boolean;
};

function resolveVisibleBlockId(
  startId: string | null,
  answers: Record<string, unknown>,
  form: Form,
): string | null {
  let blockId = startId;
  const visited = new Set<string>();

  while (blockId) {
    if (visited.has(blockId)) return null;
    visited.add(blockId);

    if (isBlockVisible(blockId, answers, form)) {
      return blockId;
    }

    blockId = getNextBlockId(blockId, answers, form);
  }

  return null;
}

export default function FormRuntime({ form, formId, preview }: Props) {
  const router = useRouter();
  const runtimeFormId = formId ?? form.id;
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(
    resolveVisibleBlockId(form.blocks[0]?.id ?? null, {}, form),
  );
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showRequiredAlert, setShowRequiredAlert] = useState(false);
  const [ratingHover, setRatingHover] = useState<number | null>(null);
  const [uploadingByBlock, setUploadingByBlock] = useState<
    Record<string, boolean>
  >({});
  const [open, setOpen] = useState(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  function getOrCreateSessionId() {
    return sessionIdRef.current;
  }

  const trackEvent = useCallback(
    async (eventType: "view" | "answer" | "submit", blockId?: string) => {
      if (preview || !runtimeFormId) return;
      const sessionId = getOrCreateSessionId();
      const { error } = await supabase.from("form_events").insert({
        form_id: runtimeFormId,
        session_id: sessionId,
        event_type: eventType,
        ...(blockId ? { block_id: blockId } : {}),
      });
      if (error) {
        console.error(`[form_events:${eventType}]`, error);
      }
    },
    [preview, runtimeFormId],
  );

  useEffect(() => {
    if (preview) return; // don't track preview
    if (!runtimeFormId) return;

    void trackEvent("view");
  }, [runtimeFormId, preview, trackEvent]);

  useEffect(() => {
    if (preview) return;
    if (!runtimeFormId || !currentBlockId) return;

    void trackEvent("view", currentBlockId);
  }, [runtimeFormId, currentBlockId, preview, trackEvent]);

  const nextBlockId = useMemo(() => {
    if (!currentBlockId) return null;
    return getNextBlockId(currentBlockId, answers, form);
  }, [currentBlockId, answers, form]);

  const blockById = useMemo(() => {
    const map = new Map<string, Form["blocks"][number]>();
    for (const b of form.blocks) map.set(b.id, b);
    return map;
  }, [form.blocks]);

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

  const foundBlock = blockById.get(currentBlockId);
  if (!foundBlock) return <div>Invalid block</div>;
  const block = foundBlock;

  async function submitForm(
    finalAnswers: Record<string, unknown>,
  ): Promise<boolean> {
    if (preview) {
      return true;
    }

    const filtered: Record<string, unknown> = {};

    if (submitting) return false;
    setSubmitting(true);

    for (const block of form.blocks) {
      if (!isBlockVisible(block.id, finalAnswers, form)) continue;
      if (finalAnswers[block.id] === undefined) continue;

      filtered[block.id] = finalAnswers[block.id];
    }

    const { error } = await supabase.from("responses").insert({
      form_id: runtimeFormId,
      answers: filtered,
    });

    if (error) {
      console.error("Submit failed:", error);
      alert("Submission failed. Please try again.");
      setSubmitting(false);
      return false;
    }

    // 🔥 TRACK SUBMIT EVENT
    await trackEvent("submit");

    return true;
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

    //Date Validation
    if (block.type === "date") {
      const val = String(value ?? "").trim();

      if (block.required && !val) {
        toast.warning("Please select a date");
        return;
      }
    }

    // LINK VALIDATION
    if (block.type === "link") {
      let v = String(value ?? "").trim();

      // optional + empty → allow skip
      if (!block.required && v.length === 0) {
        // do nothing
      } else {
        if (block.required && v.length === 0) {
          toast.error("Please enter a link");
          return;
        }

        //  AUTO ADD https://
        if (v && !v.startsWith("http")) {
          v = "https://" + v;
        }

        // validate final URL
        if (v.length > 0 && !isValidUrl(v)) {
          toast.error("Enter a valid URL");
          return;
        }

        // store the normalized version
        nextAnswers[currentBlockId!] = v;
      }
    }

    // NUMBER VALIDATION
    if (block.type === "number") {
      const raw = value;

      if (
        !block.required &&
        (raw === "" || raw === null || raw === undefined)
      ) {
        // allow skip
      } else {
        const num = Number(raw);

        if (isNaN(num)) {
          toast.error("Enter a valid number");
          return;
        }

        if (block.config.min !== undefined && num < block.config.min) {
          toast.error(`Number must be ≥ ${block.config.min}`);
          return;
        }

        if (block.config.max !== undefined && num > block.config.max) {
          toast.error(`Number must be ≤ ${block.config.max}`);
          return;
        }
      }
    }

    //rating validation
    if (block.type === "rating") {
      if (block.required && !value) {
        toast.error("Please select a rating");
        return;
      }
    }

    //file upload validation
    if (block.type === "fileUpload") {
      if (block.required && (!value || (value as string[]).length === 0)) {
        toast.error("Please upload a file");
        return;
      }
    }

    //linear scale validation
    if (block.type === "linear_scale") {
      if (block.required && answers[currentBlockId!] === undefined) {
        toast.error("Please select a value");
        return;
      }
    }

    // 🔥 TRACK ANSWER EVENT
    if (!preview && currentBlockId) {
      void trackEvent("answer", currentBlockId);
    }

    const rawNext = getNextBlockId(currentBlockId!, nextAnswers, form);
    const next = resolveVisibleBlockId(rawNext, nextAnswers, form);

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
      const didSubmit = await submitForm(nextAnswers);
      if (!didSubmit) return;
      setCurrentBlockId(null);
      setAnswers({});
      return;
    }

    setHistory((h) => [...h, currentBlockId!]);
    setCurrentBlockId(next);
  }

  function goBack() {
    if (history.length === 0) return;
    for (let i = history.length - 1; i >= 0; i--) {
      const prev = history[i];
      if (!isBlockVisible(prev, answers, form)) continue;

      setHistory(history.slice(0, i));
      setCurrentBlockId(prev);
      return;
    }
  }

  const rawValue = answers[block.id];

  const selectedArray: string[] = Array.isArray(rawValue) ? rawValue : [];
  const selectedSingle: string | undefined =
    typeof rawValue === "string" ? rawValue : undefined;

  const url = String(answers[block.id] ?? "");
  const domain = url
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .trim();
  const cleanDomain = domain.trim();

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
                  className="w-full focus:outline-none focus:ring-4 focus:ring-blue-200 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  value={(answers[block.id] as string) ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [block.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitAnswer(e.currentTarget.value);
                    }
                  }}
                />
                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100  py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
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
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
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
                  className="w-full focus:outline-none focus:ring-4 focus:ring-blue-200 border border-gray-300 rounded-md shadow-sm px-3 py-2 "
                  rows={block.config.rows}
                  value={(answers[block.id] as string) ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [block.id]: e.target.value,
                    }))
                  }
                />
                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100  py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
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
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
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
                  className="w-full focus:outline-none focus:ring-4 focus:ring-blue-200 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  value={(answers[block.id] as string) ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [block.id]: e.target.value,
                    }))
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
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
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
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
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
                  className="w-full focus:outline-none focus:ring-4 focus:ring-blue-200 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  value={(answers[block.id] as string) ?? ""}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setAnswers((prev) => ({
                      ...prev,
                      [block.id]: onlyDigits,
                    }));
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
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
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
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "date" && (
              <>
                {(() => {
                  const value = answers[block.id] as string | undefined;
                  const selectedDate = value ? new Date(value) : undefined;

                  function format(d?: Date) {
                    if (!d) return "Select date";
                    return d.toLocaleDateString();
                  }

                  return (
                    <div className="w-fit">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="border cursor-pointer border-gray-300 shadow-sm rounded-md px-3 py-2 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-blue-200 text-left min-w-[180px] flex items-center justify-between"
                          >
                            <span>{format(selectedDate)}</span>
                            <ChevronDownIcon className="ml-2 h-4 w-4 text-neutral-500" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            defaultMonth={selectedDate}
                            captionLayout="dropdown"
                            className="[&_button]:cursor-pointer [&_[role=gridcell]]:cursor-pointer [&_select]:cursor-pointer"
                            onSelect={(d) => {
                              if (!d) return;

                              // fix timezone shift (toISOString converts to UTC which can subtract a day)
                              const year = d.getFullYear();
                              const month = String(d.getMonth() + 1).padStart(
                                2,
                                "0",
                              );
                              const day = String(d.getDate()).padStart(2, "0");

                              const localISO = `${year}-${month}-${day}`;

                              setAnswers((prev) => ({
                                ...prev,
                                [block.id]: localISO,
                              }));
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  );
                })()}

                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2 font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "link" && (
              <>
                <input
                  type="url"
                  placeholder={block.config.placeholder || "https://fillin.com"}
                  className="w-full border focus:outline-none focus:ring-4 focus:ring-blue-200 border-gray-300 rounded-md shadow-sm px-3 py-2"
                  onBlur={(e) => {
                    let v = e.target.value.trim();
                    if (v && !v.startsWith("http")) {
                      v = "https://" + v;
                      setAnswers((prev) => ({
                        ...prev,
                        [block.id]: v,
                      }));
                    }
                  }}
                  value={(answers[block.id] as string) ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [block.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitAnswer(e.currentTarget.value);
                    }
                  }}
                />

                {url && (
                  <div className="text-xs mt-1 text-neutral-500 flex items-center gap-2">
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                        cleanDomain,
                      )}`}
                      alt="preview"
                      width={20}
                      height={20}
                    />
                    {domain}
                  </div>
                )}

                {(() => {
                  const nextId = nextBlockId;

                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
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

                          setAnswers((prev) => ({
                            ...prev,
                            [block.id]: next,
                          }));
                        } else {
                          setAnswers((prev) => ({
                            ...prev,
                            [block.id]: opt.id,
                          }));
                        }
                      }}
                    />
                    <span className="select-none">{opt.label}</span>
                  </div>
                ))}

                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100  py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        disabled={
                          submitting ||
                          (block.required && answers[block.id] === undefined)
                        }
                        className={`px-2 py-1 border min-w-[80px] text-white rounded-md font-semibold cursor-pointer disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {block.type === "number" && (
              <>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter a number"
                  pattern="[0-9]*"
                  className="w-full focus:outline-none focus:ring-4 focus:ring-blue-200 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  value={
                    answers[block.id] === undefined ||
                    answers[block.id] === null
                      ? ""
                      : String(answers[block.id])
                  }
                  onChange={(e) => {
                    const raw = e.target.value;

                    // allow empty
                    if (raw === "") {
                      setAnswers((prev) => ({
                        ...prev,
                        [block.id]: "",
                      }));
                      return;
                    }

                    // only allow digits
                    if (!/^\d+$/.test(raw)) {
                      return;
                    }

                    setAnswers((prev) => ({
                      ...prev,
                      [block.id]: Number(raw),
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitAnswer(answers[block.id]);
                    }
                  }}
                  min={block.config.min}
                  max={block.config.max}
                />

                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "rating" && (
              <>
                <div
                  className="flex gap-0.5"
                  onMouseLeave={() => {
                    const selectedValue =
                      typeof answers[block.id] === "number"
                        ? (answers[block.id] as number)
                        : 0;
                    if (!selectedValue) setRatingHover(null);
                  }}
                >
                  {Array.from({ length: block.config.max ?? 5 }).map((_, i) => {
                    const value = i + 1;
                    const selectedValue =
                      typeof answers[block.id] === "number"
                        ? (answers[block.id] as number)
                        : 0;
                    const displayValue =
                      selectedValue > 0 ? selectedValue : (ratingHover ?? 0);
                    const selected = value <= displayValue;

                    return (
                      <button
                        key={i}
                        type="button"
                        className="cursor-pointer "
                        onMouseEnter={() => {
                          if (!selectedValue) setRatingHover(value);
                        }}
                        onMouseMove={() => {
                          if (!selectedValue) setRatingHover(value);
                        }}
                        onClick={() => {
                          setAnswers((prev) => ({
                            ...prev,
                            [block.id]: value,
                          }));
                          setRatingHover(null);
                        }}
                      >
                        <Star
                          size={34}
                          className={
                            selected
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-400 hover:text-yellow-400"
                          }
                        />
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="px-2  font-bold hover:bg-neutral-100 py-1 border rounded-md text-md text-neutral-500 hover:text-neutral-600"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "fileUpload" && (
              <>
                {/** Styled upload box */}
                <label
                  htmlFor={`runtime_file_${block.id}`}
                  onClick={(e) => {
                    // if clicking inside preview area, don't reopen file dialog
                    const target = e.target as HTMLElement;
                    if (target.closest("button")) return;
                  }}
                  className="mt-2 flex flex-col items-center justify-center text-center w-full border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 cursor-pointer hover:border-gray-400 hover:shadow-md transition"
                >
                  <input
                    id={`runtime_file_${block.id}`}
                    type="file"
                    multiple={block.config.multiple}
                    accept={block.config.accept}
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setUploadingByBlock((prev) => ({
                        ...prev,
                        [block.id]: true,
                      }));

                      const uploadedUrls: string[] = [];

                      for (const file of Array.from(files)) {
                        const sizeMB = file.size / 1024 / 1024;

                        if (
                          block.config.maxSizeMB &&
                          sizeMB > block.config.maxSizeMB
                        ) {
                          toast.error(
                            `Max file size is ${block.config.maxSizeMB}MB`,
                          );
                          setUploadingByBlock((prev) => ({
                            ...prev,
                            [block.id]: false,
                          }));
                          return;
                        }

                        const filePath = `${runtimeFormId}/${
                          block.id
                        }/${crypto.randomUUID()}-${file.name}`;

                        const { error } = await supabase.storage
                          .from("uploads")
                          .upload(filePath, file);

                        if (error) {
                          console.error("UPLOAD ERROR:", error);
                          toast.error("Upload failed");
                          setUploadingByBlock((prev) => ({
                            ...prev,
                            [block.id]: false,
                          }));
                          return;
                        }

                        const { data } = supabase.storage
                          .from("uploads")
                          .getPublicUrl(filePath);

                        uploadedUrls.push(data.publicUrl);
                      }

                      // store uploaded URLs but do not submit yet
                      setAnswers((prev) => ({
                        ...prev,
                        [block.id]: uploadedUrls,
                      }));
                      setUploadingByBlock((prev) => ({
                        ...prev,
                        [block.id]: false,
                      }));
                    }}
                  />

                  {/* Show spinner while uploading */}
                  {uploadingByBlock[block.id] && (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Spinner height={54} width={54} strokeWidth={2} />
                      <div className="text-xs text-neutral-500 mt-2">
                        Uploading...
                      </div>
                    </div>
                  )}
                  {!uploadingByBlock[block.id] &&
                    (() => {
                      const fileList = answers[block.id];
                      const hasFiles =
                        Array.isArray(fileList) && fileList.length > 0;
                      return (
                        <>
                          {/* Preview in center */}
                          {hasFiles && (
                            <div className="mb-4 flex flex-col p-4 shadow-sm border rounded-md items-center justify-center  relative">
                              {fileList.map((url: string, idx: number) => {
                                const isImage =
                                  /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
                                const isPdf = /\.pdf$/i.test(url);

                                return (
                                  <div
                                    key={idx}
                                    className="flex flex-col items-center w-full"
                                  >
                                    {isImage && (
                                      <Image
                                        src={url}
                                        alt="preview"
                                        width={160}
                                        height={160}
                                        className="rounded-md object-cover mb-3"
                                      />
                                    )}

                                    {isPdf && (
                                      <div className="w-full flex justify-center mb-3">
                                        <iframe
                                          src={url}
                                          className="w-full h-56 border rounded-md"
                                        />
                                      </div>
                                    )}

                                    {!isImage && !isPdf && (
                                      <a
                                        href={url}
                                        target="_blank"
                                        className="text-sm text-blue-600 underline mb-3"
                                      >
                                        {url.split("/").pop()}
                                      </a>
                                    )}
                                  </div>
                                );
                              })}

                              {/* bottom divider line */}
                              <div className="w-full border-t mt-2 pt-2 flex items-center justify-between">
                                {/* File name on left */}
                                <div className="text-xs text-neutral-600 truncate max-w-[70%]">
                                  {(() => {
                                    const urls = fileList;
                                    if (!urls || urls.length === 0) return null;
                                    const raw = urls[0].split("/").pop() || "";
                                    // strip leading UUID (36 chars + dash) safely
                                    const originalName = raw.replace(
                                      /^[0-9a-f-]{36}-/i,
                                      "",
                                    );
                                    return originalName;
                                  })()}
                                </div>

                                {/* Trash on right */}
                                <TooltipHint label="Delete">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      setAnswers((prev) => ({
                                        ...prev,
                                        [block.id]: [],
                                      }));
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-md cursor-pointer"
                                  >
                                    <Trash2
                                      size={18}
                                      className="text-neutral-400 hover:text-neutral-600"
                                    />
                                  </button>
                                </TooltipHint>
                              </div>
                            </div>
                          )}

                          {(() => {
                            const fileValue = answers[block.id];
                            return (
                              !Array.isArray(fileValue) ||
                              fileValue.length === 0
                            );
                          })() && (
                            <>
                              <div
                                tabIndex={0}
                                className="text-sm hover:text-neutral-900 rounded-md px-2 py-1
             focus:outline-none focus:ring-4 focus:ring-blue-200
             hover:bg-neutral-100
             flex gap-2 items-center font-medium text-neutral-500"
                              >
                                <Upload size={16} />
                                Click to upload file
                              </div>

                              {block.config.maxSizeMB && (
                                <div className="text-xs text-neutral-400 mt-1">
                                  Max size: 10 Mb
                                </div>
                              )}
                            </>
                          )}
                        </>
                      );
                    })()}
                </label>

                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          onClick={goBack}
                          className="px-2 py-1 border rounded-md text-neutral-600 hover:bg-neutral-100"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "time" && (
              <>
                {(() => {
                  const current = (answers[block.id] as string) ?? "";
                  const [h, m] = current.split(":");

                  function updateTime(nextHour?: string, nextMinute?: string) {
                    const hour = nextHour ?? h ?? "";
                    const minute = nextMinute ?? m ?? "";

                    if (!hour && !minute) {
                      setAnswers((prev) => ({
                        ...prev,
                        [block.id]: "",
                      }));
                      return;
                    }

                    const value = `${hour || "00"}:${minute || "00"}`;
                    setAnswers((prev) => ({
                      ...prev,
                      [block.id]: value,
                    }));
                  }

                  return (
                    <div className="flex items-center gap-2">
                      {/* Hour dropdown */}
                      <select
                        value={h ?? ""}
                        onChange={(e) => updateTime(e.target.value, m)}
                        className="border border-neutral-300 shadow-sm  rounded-md px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer"
                      >
                        <option value="">Hour</option>
                        {HOURS.map((hr) => (
                          <option key={hr} value={hr}>
                            {hr}
                          </option>
                        ))}
                      </select>

                      <span className="text-lg font-semibold">:</span>

                      {/* Minute dropdown */}
                      <select
                        value={m ?? ""}
                        onChange={(e) => updateTime(h, e.target.value)}
                        className="border border-neutral-300 shadow-sm  cursor-pointer rounded-md px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      >
                        <option value="">Minutes</option>
                        {MINUTES.map((min) => (
                          <option key={min} value={min}>
                            {min}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })()}

                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          onClick={goBack}
                          className="px-2 py-1 border rounded-md text-neutral-600 hover:bg-neutral-100"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {block.type === "linear_scale" && (
              <>
                <div className="space-y-2 w-fit">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{block.config.minLabel}</span>
                    <span>{block.config.maxLabel}</span>
                  </div>

                  <div className="inline-flex gap-2 flex-wrap">
                    {Array.from({
                      length: block.config.max - block.config.min + 1,
                    }).map((_, i) => {
                      const v = block.config.min + i;
                      const selected = answers[block.id] === v;

                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [block.id]: v,
                            }))
                          }
                          className={`px-3 py-2 cursor-pointer border border-neutral-300 shadow-sm hover:shadow-md rounded-md min-w-[42px]
                ${
                  selected
                    ? "bg-black text-white"
                    : "bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                }
              `}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(() => {
                  const nextId = nextBlockId;
                  return (
                    <div className="mt-4 flex gap-2">
                      {history.length > 0 && (
                        <button
                          onClick={goBack}
                          className="px-2 py-1 border rounded-md text-neutral-600 hover:bg-neutral-100"
                        >
                          ←
                        </button>
                      )}

                      <button
                        className={`px-2 py-1 border text-white rounded-md cursor-pointer font-semibold disabled:cursor-not-allowed ${
                          nextId
                            ? "bg-black hover:bg-neutral-700"
                            : "bg-primary hover:bg-primary/90 focus:ring-4 ring-blue-300"
                        }`}
                        onClick={() => submitAnswer(answers[block.id])}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center min-w-[80px] justify-center w-full">
                            <Spinner height={20} width={20} strokeWidth={3} />
                          </span>
                        ) : nextId ? (
                          "Next →"
                        ) : (
                          "Submit →"
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
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
