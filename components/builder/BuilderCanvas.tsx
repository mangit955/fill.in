"use client";

import { FormBlock } from "@/lib/forms/types";
import BlockRenderer from "./BuilderRenderer";

type BuilderCanvasProps = {
  blocks: FormBlock[];
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: <T extends FormBlock>(
    blockId: string,
    updater: (config: T["config"]) => T["config"]
  ) => void;
};

export default function BuilderCanvas({
  blocks,
  onUpdateMeta,
  onUpdateConfig,
}: BuilderCanvasProps) {
  if (blocks.length === 0) {
    return (
      <div className="min-h-[400px] border border-dashed rounded-md p-6">
        <p className="text-muted-foreground text-sm">
          No fields yet. Add a block to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={onUpdateConfig}
        />
      ))}
    </div>
  );
}
