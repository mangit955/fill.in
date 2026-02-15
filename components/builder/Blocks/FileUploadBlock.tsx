import { FileUploadBlock as FileUploadBlockType } from "@/lib/forms/types";
import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import TooltipHint from "@/components/ui/toolTipHint";

type Props = {
  block: FileUploadBlockType;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (
      config: FileUploadBlockType["config"],
    ) => FileUploadBlockType["config"],
  ) => void;
};

export default function FileUploadBlock({
  block,
  autoFocus,
  onUpdateConfig,
  onUpdateMeta,
}: Props) {
  const [isEditing, setIsEditing] = useState(autoFocus ?? false);
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

      {/* Upload box */}
      <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/40 px-4 py-6 text-center hover:border-gray-400  transition ">
        <input className="hidden" />
        <Upload className="h-6 w-6 text-muted-foreground" />

        <div
          tabIndex={0}
          className="text-sm cursor-pointer
             focus:ring-4 focus:ring-blue-200 focus:outline-none
             hover:bg-gray-100 text-neutral-500 hover:text-neutral-700
             px-2 py-1 rounded-md"
        >
          <span className="font-medium">Click to upload</span>
          <span> or drag and drop</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Size limit: 10 MB. For file uploads upgrade.
        </p>
      </label>
    </div>
  );
}
