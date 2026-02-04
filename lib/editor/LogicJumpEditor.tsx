"use client";

import { FormBlock, LogicJump } from "../forms/types";
import ConditionEditor from "./ConditionEditor";

type Props = {
  jump: LogicJump;
  availableTargetBlocks: FormBlock[];
  onChange: (jump: LogicJump) => void;
  onRemove: () => void;
};

export default function LogicJumpEditor({
  jump,
  availableTargetBlocks,
  onChange,
  onRemove,
}: Props) {
  const isValid =
    jump.toBlockId && jump.condition.operator && jump.condition.value !== "";

  return (
    <div className="flex flex-wrap item-center gap-2 text-xs">
      {/* If condition */}
      <ConditionEditor
        mode="jump"
        condition={jump.condition}
        availableBlocks={[]}
        onChange={(condition) => onChange({ ...jump, condition })}
      />

      {/* Go to */}
      <span>→ Go to</span>

      <select
        value={jump.toBlockId}
        disabled={!isValid && !jump.toBlockId}
        onChange={(e) => onChange({ ...jump, toBlockId: e.target.value })}
        className="border rounded px-1 py-0.5"
      >
        <option value="" disabled>
          Select block
        </option>
        {availableTargetBlocks.map((b) => (
          <option key={b.id} value={b.id}>
            {b.config.label}
          </option>
        ))}
      </select>

      <button className="text-red-500 hover:underline ml-2" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
