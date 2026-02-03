"use client";

import { FormBlock, VisibilityRule } from "@/lib/forms/types";
import { ReactNode } from "react";
import BlockConditionSection from "./BlockConditionSection";

type Props = {
  block: FormBlock;
  blocks: FormBlock[];
  visibilityRules: VisibilityRule[];
  onUpsertRule: (rule: VisibilityRule) => void;
  onRemoveRule: (targetBlockId: string) => void;
  children: ReactNode;
};

export default function BlockShell({
  block,
  children,
  blocks,
  visibilityRules,
  onRemoveRule,
  onUpsertRule,
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
      </div>
    </div>
  );
}
