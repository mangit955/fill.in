"use client";

import LogicJumpEditor from "@/lib/editor/LogicJumpEditor";
import { getNextJumpOrder } from "@/lib/forms/helpers";
import { FormBlock, LogicJump } from "@/lib/forms/types";

type Props = {
  block: FormBlock;
  blocks: FormBlock[];
  logicJumps: LogicJump[];
  onAddJump: (jump: LogicJump) => void;
  onUpdateJump: (
    jumpId: string,
    updates: Partial<Omit<LogicJump, "id">>
  ) => void;
  onRemoveJump: (jumpId: string) => void;
};

export default function BlockLogicJumpSection({
  block,
  blocks,
  logicJumps,
  onAddJump,
  onUpdateJump,
  onRemoveJump,
}: Props) {
  const blockIndex = blocks.findIndex((b) => b.id === block.id);

  const jumpsForBlock = logicJumps
    .filter((j) => j.fromBlockId === block.id)
    .sort((a, b) => a.order - b.order);

  const availableTargetBlocks = blocks.slice(blockIndex + 1);

  return (
    <div className="mt-3 space-y-2">
      {jumpsForBlock.map((jump) => (
        <LogicJumpEditor
          key={jump.id}
          jump={jump}
          availableTargetBlocks={availableTargetBlocks}
          onChange={(updated) => onUpdateJump(jump.id, updated)}
          onRemove={() => onRemoveJump(jump.id)}
        />
      ))}

      <button
        className="text-xs text-white hover:text-muted-foreground cursor-pointer"
        onClick={() =>
          onAddJump({
            id: crypto.randomUUID(),
            fromBlockId: block.id,
            toBlockId: "",
            condition: {
              blockId: "",
              operator: "equals",
              value: "",
            },
            order: getNextJumpOrder(logicJumps, block.id),
          })
        }
      >
        + Add logic jump
      </button>
    </div>
  );
}
