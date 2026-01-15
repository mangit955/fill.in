import { MultipleChoiceBlock as MultipleChoiceBlockType } from "@/lib/forms/types";
import RequiredToggle from "./controls/RequiredToggle";
import { useEffect, useRef, useState } from "react";

type Props = {
  block: MultipleChoiceBlockType;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (
      config: MultipleChoiceBlockType["config"]
    ) => MultipleChoiceBlockType["config"]
  ) => void;
};

export default function MultipleChoiceBlock({
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
          className="w-full border rounded px-2 py-1 text-sm mb-1"
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

      {/* options */}
      <div className="space-y-2">
        {block.config.options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <input
              type={block.config.allowMultiple ? "checkbox" : "radio"}
              disabled
            />
            <input
              value={option.label}
              onChange={(e) =>
                onUpdateConfig(block.id, (config) => ({
                  ...config,
                  options: config.options.map((o) =>
                    o.id === option.id ? { ...o, label: e.target.value } : o
                  ),
                }))
              }
              className="border rounded px-2 py-1 text-sm w-full"
            />
            <button
              disabled={block.config.options.length === 1}
              onClick={() =>
                onUpdateConfig(block.id, (config) => ({
                  ...config,
                  options:
                    config.options.length === 1
                      ? config.options
                      : config.options.filter((o) => o.id !== option.id),
                }))
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add option */}
      <button
        className="text-sm textblue-600"
        onClick={() =>
          onUpdateConfig(block.id, (config) => ({
            ...config,
            options: [
              ...config.options,
              { id: crypto.randomUUID(), label: "" },
            ],
          }))
        }
      >
        + Add option
      </button>

      {/* Multiple select toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={block.config.allowMultiple}
          onChange={(e) =>
            onUpdateConfig(block.id, (config) => ({
              ...config,
              allowMultiple: e.target.checked,
            }))
          }
        />
        Allow multiple selections
      </label>

      {/* Required toggle */}
      <RequiredToggle
        required={block.required}
        onChange={(required) => onUpdateMeta(block.id, { required })}
      />
    </div>
  );
}
