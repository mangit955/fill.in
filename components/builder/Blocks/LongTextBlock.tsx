import { LongTextBlock as LongTextBlockType } from "@/lib/forms/types";
import { useEffect, useRef, useState } from "react";
import { AlignLeft } from "lucide-react";
import TooltipHint from "@/components/ui/toolTipHint";

type Props = {
  block: LongTextBlockType;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (
      config: LongTextBlockType["config"],
    ) => LongTextBlockType["config"],
  ) => void;
};

export default function LongTextBlock({
  block,
  autoFocus,
  onUpdateConfig,
  onUpdateMeta,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(block.config.label);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (autoFocus && isEditing) {
      inputRef.current?.focus();
    }
  }, [autoFocus, isEditing]);

  useEffect(() => {
    if (autoFocus) {
      setIsEditing(true);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (!isEditing) {
      setValue(block.config.label);
    }
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
          className="w-full font-medium placeholder:text-neutral-300 placeholder:font-semibold placeholder:text-2xl px-2 py-1 text-xl mb-2 border-none bg-transparent outline-none"
        />
      ) : (
        <p
          className="text-xl mb-2 font-medium cursor-pointer"
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

      {/* Disable text-input box preview */}
      <div className="relative mb-2">
        <textarea
          disabled
          rows={block.config.rows}
          placeholder="Long Answer"
          className="w-full shadow-sm hover:shadow-md  border-gray-300 rounded-md border px-2 py-1"
        />

        <AlignLeft
          size={16}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
