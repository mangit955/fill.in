import { LinearScaleBlock as LinearScaleBlockType } from "@/lib/forms/types";
import { useEffect, useRef, useState } from "react";
import TooltipHint from "@/components/ui/toolTipHint";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  block: LinearScaleBlockType;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (
      config: LinearScaleBlockType["config"],
    ) => LinearScaleBlockType["config"],
  ) => void;
};

export default function LinearScaleBlock({
  block,
  autoFocus,
  onUpdateConfig,
  onUpdateMeta,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(block.config.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const { min, max, minLabel, maxLabel } = block.config;

  const MIN_ALLOWED = 1;
  const MAX_ALLOWED = 10;

  const safeMin = Math.max(MIN_ALLOWED, Math.min(min, max - 1));
  const safeMax = Math.min(MAX_ALLOWED, Math.max(max, min + 1));

  function save() {
    if (value === block.config.label) {
      setIsEditing(false);
      return;
    }

    onUpdateConfig(block.id, (config) => ({
      ...config,
      label: value,
    }));

    setIsEditing(false);
  }

  useEffect(() => {
    if (autoFocus && isEditing) inputRef.current?.focus();
  }, [autoFocus, isEditing]);

  useEffect(() => {
    if (autoFocus) setIsEditing(true);
  }, [autoFocus]);

  useEffect(() => {
    if (!isEditing) setValue(block.config.label);
  }, [block.config.label, isEditing]);

  return (
    <div className="p-4">
      {/* Label */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={value}
          placeholder="Type a question"
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              save();
            }
            if (e.key === "Escape") {
              setValue(block.config.label);
              setIsEditing(false);
            }
          }}
          className="w-full font-medium placeholder:text-neutral-300 placeholder:font-bold placeholder:text-2xl rounded mb-3 px-2 py-1 bg-transparent outline-none text-xl"
        />
      ) : (
        <p
          className="text-xl mb-3 font-medium cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {block.config.label}
          <TooltipHint label="Required">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onUpdateMeta(block.id, { required: !block.required });
              }}
              className={`ml-1 text-2xl cursor-pointer transition ${
                block.required
                  ? "text-red-500 hover:text-red-600"
                  : "text-neutral-300 hover:text-neutral-500"
              }`}
            >
              *
            </span>
          </TooltipHint>
        </p>
      )}

      {/* Scale preview */}
      <div className="mb-3">
        <div className="inline-block">
          <div className="flex flex-col gap-1">
            {/* labels */}
            <motion.div
              layout
              className="flex justify-between text-xs text-neutral-500 w-full"
            >
              <motion.span
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="max-w-[45%] text-left wrap-break-words"
              >
                {minLabel || ""}
              </motion.span>

              <motion.span
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="max-w-[45%] text-right wrap-break-words"
              >
                {maxLabel || ""}
              </motion.span>
            </motion.div>

            {/* buttons */}
            <div className="inline-flex gap-2">
              <AnimatePresence initial={false}>
                {Array.from({ length: safeMax - safeMin + 1 }).map((_, i) => {
                  const v = safeMin + i;

                  return (
                    <motion.button
                      key={v}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      type="button"
                      disabled
                      className="px-3 py-2 border border-neutral-300 shadow-sm rounded-md min-w-[42px] bg-white text-neutral-500"
                    >
                      {v}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs  text-neutral-400">Min</span>
        <select
          value={safeMin}
          onChange={(e) => {
            const nextMin = Number(e.target.value);
            onUpdateConfig(block.id, (c) => {
              const adjustedMax = Math.max(c.max, nextMin + 1);
              return { ...c, min: nextMin, max: adjustedMax };
            });
          }}
          className="border border-neutral-300 hover:bg-neutral-100 px-2 py-1 rounded-md cursor-pointer focus:ring-4 focus:ring-blue-200 focus:outline-none text-sm bg-white"
        >
          {Array.from({ length: safeMax - MIN_ALLOWED }).map((_, i) => {
            const val = MIN_ALLOWED + i;
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>

        <span className="text-xs text-neutral-400">Max</span>
        <select
          value={safeMax}
          onChange={(e) => {
            const nextMax = Number(e.target.value);
            onUpdateConfig(block.id, (c) => {
              const adjustedMin = Math.min(c.min, nextMax - 1);
              return { ...c, max: nextMax, min: adjustedMin };
            });
          }}
          className="border border-neutral-300 hover:bg-neutral-100 cursor-pointer focus:ring-4 focus:ring-blue-200 focus:outline-none px-2 py-1 rounded-md text-sm bg-white"
        >
          {Array.from({ length: MAX_ALLOWED - safeMin }).map((_, i) => {
            const val = safeMin + 1 + i;
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
