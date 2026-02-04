"use client";

import { FormBlock, LogicCondition, LogicOperator } from "@/lib/forms/types";

type Props = {
  condition: LogicCondition;
  availableBlocks: FormBlock[];
  onChange: (condition: LogicCondition) => void;
  mode?: "visibility" | "jump";
};

const OPERATORS: LogicOperator[] = ["equals", "not_equals", "contains"];

export default function ConditionEditor({
  condition,
  availableBlocks,
  onChange,
  mode = "visibility",
}: Props) {
  const isJump = mode === "jump";
  const isSourceSelected = Boolean(condition.blockId);

  return (
    <div className="flex flex-wrap gap-2 items-center text-xs">
      {/* Source Block */}
      {!isJump && (
        <select
          value={condition.blockId}
          onChange={(e) => onChange({ ...condition, blockId: e.target.value })}
          className="border rounded px-1 py-0.5"
        >
          <option value="" disabled>
            Select question
          </option>
          {availableBlocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.config.label}
            </option>
          ))}
        </select>
      )}

      {/* Operator */}
      <select
        value={condition.operator}
        disabled={!isSourceSelected}
        onChange={(e) =>
          onChange({ ...condition, operator: e.target.value as LogicOperator })
        }
        className="border rounded px-1 py-0.5"
      >
        {OPERATORS.map((op) => (
          <option key={op} value={op}>
            {op.replace("_", " ")}
          </option>
        ))}
      </select>

      {/* Value */}
      <input
        type="text"
        disabled={!isSourceSelected}
        value={String(condition.value ?? "")}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
        className="border rounded px-1 py-0.5 w-24"
        placeholder="value"
      ></input>
    </div>
  );
}
