"use client";

import { FormBlock, LogicJump, VisibilityRule } from "@/lib/forms/types";
import { ReactNode } from "react";
import BlockConditionSection from "./BlockConditionSection";
import BlockLogicJumpSection from "./BlockLogicJumpSection";

type Props = {
  block: FormBlock;
  blocks: FormBlock[];
  visibilityRules: VisibilityRule[];
  onUpsertRule: (rule: VisibilityRule) => void;
  onRemoveRule: (targetBlockId: string) => void;
  children: ReactNode;
  logicJumps: LogicJump[];
  onAddLogicJump: (jump: LogicJump) => void;
  onRemoveLogicJump: (jumpId: string) => void;
  onUpdateLogicJump: (
    jumpId: string,
    updates: Partial<Omit<LogicJump, "id">>
  ) => void;
};

export default function BlockShell({
  block,
  children,
  blocks,
  visibilityRules,
  onRemoveRule,
  onUpsertRule,
  logicJumps,
  onAddLogicJump,
  onRemoveLogicJump,
  onUpdateLogicJump,
}: Props) {
  return (
    <div className="relative  space-y-3">
      {/* Block content */}
      {children}

      {/* Condition UI placeholder (Phase 10.3) */}
      <div className="mt-2 text-xs text-muted-foreground">
        {/* condition editor will go here */}
        <BlockConditionSection
          block={block}
          blocks={blocks}
          visibilityRules={visibilityRules}
          onRemoveRule={onRemoveRule}
          onUpsertRule={onUpsertRule}
        />
        <BlockLogicJumpSection
          block={block}
          blocks={blocks}
          logicJumps={logicJumps}
          onAddJump={onAddLogicJump}
          onUpdateJump={onUpdateLogicJump}
          onRemoveJump={onRemoveLogicJump}
        />
      </div>
    </div>
  );
}
