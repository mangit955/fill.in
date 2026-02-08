import { LinkBlock as LinkBlockType } from "@/lib/forms/types";
import { useEffect, useRef, useState } from "react";
import { Link } from "lucide-react";
import TooltipHint from "@/components/ui/toolTipHint";

type Props = {
  block: LinkBlockType;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (config: LinkBlockType["config"]) => LinkBlockType["config"]
  ) => void;
};

export default function LinkBlock({
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
          className="w-full font-medium text-xl bg-transparent outline-none mb-2"
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
              className={`ml-1 text-2xl cursor-pointer ${
                block.required
                  ? "text-red-500"
                  : "text-neutral-300 hover:text-neutral-500"
              }`}
            >
              *
            </span>
          </TooltipHint>
        </p>
      )}

      {/* Link preview */}
      <div className="relative">
        <input
          type="url"
          disabled
          placeholder="Upload your files"
          className="w-full shadow-sm hover:shadow-md border border-gray-300 rounded-md px-2 py-1 pr-8 text-sm bg-white"
        />
        <Link
          size={16}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400"
        />
      </div>
    </div>
  );
}
