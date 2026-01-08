import { ShortTextBlock as ShortTextBlockType } from "@/lib/forms/types";
import { useEffect, useState } from "react";
import RequiredToggle from "./controls/RequiredToggle";

type Props = {
  block: ShortTextBlockType;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (
      config: ShortTextBlockType["config"]
    ) => ShortTextBlockType["config"]
  ) => void;
};

export default function ShortTextBlock({
  block,
  onUpdateConfig,
  onUpdateMeta,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(block.config.label);

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
    if (!isEditing) {
      setValue(block.config.label);
    }
  }, [block.config.label, isEditing]);

  return (
    <div className="border rounded-md p-4">
      {/* Label */}
      {isEditing ? (
        <input
          autoFocus
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
          className="w-full border rounded px-2 py-1 text-sm"
        />
      ) : (
        <p
          className="text-sm font-medium cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {block.config.label}
          {block.required && <span className="text-red-500 ml-1">*</span>}
        </p>
      )}

      {/* Disable input preview */}
      <input
        disabled
        placeholder={block.config.placeholder}
        className="w-full border rounded px-2 py-1"
      />

      {/* Required toggle */}
      <RequiredToggle
        required={block.required}
        onChange={(required) => onUpdateMeta(block.id, { required })}
      />
    </div>
  );
}
