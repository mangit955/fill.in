import { MultipleChoiceBlock as MultipleChoiceBlockType } from "@/lib/forms/types";
import RequiredToggle from "./controls/RequiredToggle";

type Props = {
  block: MultipleChoiceBlockType;
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
  onUpdateConfig,
  onUpdateMeta,
}: Props) {
  return (
    <div className="border rounded-md p-4">
      {/* Label */}
      <p className="text-sm font-medium mb-2">
        {block.config.label}{" "}
        {block.required && <span className="text-red-500">*</span>}
      </p>

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
