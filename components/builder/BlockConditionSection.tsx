"use client";

import { FormBlock, VisibilityRule } from "@/lib/forms/types";
import ConditionEditor from "../../lib/editor/ConditionEditor";

type Props = {
  block: FormBlock;
  blocks: FormBlock[];
  visibilityRules: VisibilityRule[];
  onUpsertRule: (rule: VisibilityRule) => void;
  onRemoveRule: (targetBlockId: string) => void;
};

export default function BlockConditionSection({
  block,
  blocks,
  visibilityRules,
  onUpsertRule,
  onRemoveRule,
}: Props) {
  const existingRule = visibilityRules.find(
    (r) => r.targetBlockId === block.id
  );
  const blockIndex = blocks.findIndex((b) => b.id === block.id);
  const availableBlocks = blocks.slice(0, blockIndex);

  if (availableBlocks.length === 0) {
    return null;
  }

  if (!existingRule) {
    return (
      <button
        className="text-xs text-muted-foreground hover:text-foreground"
        onClick={() => {
          const rule: VisibilityRule = {
            id: crypto.randomUUID(),
            targetBlockId: block.id,
            condition: {
              blockId: "",
              operator: "equals",
              value: "",
            },
          };
          onUpsertRule(rule);
        }}
      >
        + Add Condition
      </button>
    );
  }

  return (
    <div className="text-xs text-muted-foreground space-y-2">
      <div className="space-y-2">
        <div className="text-xs">Show this question</div>
        <ConditionEditor
          condition={existingRule.condition}
          availableBlocks={availableBlocks}
          onChange={(condition) => onUpsertRule({ ...existingRule, condition })}
        />
      </div>
      <button
        className="text-red-500 hover:underline"
        onClick={() => onRemoveRule(block.id)}
      >
        Remove Condition
      </button>
    </div>
  );
}
