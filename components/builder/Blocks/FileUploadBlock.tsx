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
      config: FileUploadBlockType["config"]
    ) => FileUploadBlockType["config"]
  ) => void;
};

export default function FileUploadBlock({
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

  const inputId = `file_${block.id}`;

  return (
    <div className="p-4">
      {/* Label */}
      {isEditing ? (
        <input
          id={inputId}
          type="file"
          hidden
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
          className="w-full font-medium placeholder:text-neutral-300 placeholder:font-bold placeholder:text-2xl rounded mb-2 px-2 py-1 bg-transparent outline-none text-xl"
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
      <label
        htmlFor={inputId}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/40 px-4 py-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition "
      >
        <input id={inputId} type="file" disabled className="hidden" />
        <Upload className="h-6 w-6 text-muted-foreground" />

        <div className="text-sm">
          <span className="font-medium text-foreground">Click to upload</span>{" "}
          <span className="text-muted-foreground">or drag and drop</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Size limit: 25 MB. For file uploads upgrade.
        </p>
      </label>
    </div>
  );
}
