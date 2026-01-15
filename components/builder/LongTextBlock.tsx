import { LongTextBlock as LongTextBlockType } from "@/lib/forms/types";
import { useEffect, useRef, useState } from "react";
import RequiredToggle from "./controls/RequiredToggle";

type Props = {
  block: LongTextBlockType;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (
      config: LongTextBlockType["config"]
    ) => LongTextBlockType["config"]
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
    <div className="shadow-sm rounded-md p-4">
      {/* Label */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={value}
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
          className="w-full px-2 py-1 text-sm mb-2"
        />
      ) : (
        <p
          className="text-sm mb-2 font-medium cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {block.config.label}
          {block.required && <span className="text-red-500 ml-1">*</span>}
        </p>
      )}

      {/* Disable text-input box preview */}

      <textarea
        disabled
        rows={block.config.rows}
        placeholder={block.config.placeholder}
        className="w-full rounded border px-2 py-1"
      />

      {/* Required toggle */}
      <RequiredToggle
        required={block.required}
        onChange={(required) => onUpdateMeta(block.id, { required })}
      />
    </div>
  );
}
