import TooltipHint from "@/components/ui/toolTipHint";
import { MultipleChoiceBlock as MultipleChoiceBlockType } from "@/lib/forms/types";
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
    <div className=" p-4">
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
          className="placeholder:text-neutral-300 placeholder:font-semibold placeholder:text-2xl w-full rounded px-2 py-1 text-xl font-medium mb-2 border-none bg-transparent outline-none"
        />
      ) : (
        <p
          className="text-xl font-medium mb-2 cursor-pointer"
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
              className="border border-gray-300 shadow-sm hover:shadow-md rounded-md px-2 py-1 text-sm w-full cursor-pointer"
            />
            <div className="hover:bg-gray-100 text-neutral-400  hover:text-neutral-600  rounded px-1">
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
                className=" cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add option */}
      <div className="hover:bg-gray-100 mb-2 mt-2 cursor-pointer  text-neutral-400 hover:text-neutral-600 w-fit rounded px-1">
        <button
          className="text-sm cursor-pointer"
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
      </div>

      {/* Multiple select toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="cursor-pointer"
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
    </div>
  );
}
