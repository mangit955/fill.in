"use client";

import { FormBlock } from "@/lib/forms/types";
import BlockRenderer from "./BuilderRenderer";
import BlockActions from "./BlockActions";

type BuilderCanvasProps = {
  blocks: FormBlock[];
  hydrated: boolean;
  activeBlockId: string | null;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: <T extends FormBlock>(
    blockId: string,
    updater: (config: T["config"]) => T["config"]
  ) => void;
  onRemove: (blockId: string) => void;
  onConsumeFocus: () => void;
};

export default function BuilderCanvas({
  blocks,
  hydrated,
  onUpdateMeta,
  onUpdateConfig,
  activeBlockId,
  onRemove,
  onConsumeFocus,
}: BuilderCanvasProps) {
  // 1️ Before hydration: render neutral shell
  if (!hydrated) {
    return (
      <div className="min-h-[400px] border border-dashed rounded-md p-6" />
    );
  }

  // 2️ After hydration: real UI decisions
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
        <div key={block.id} className="relative">
          {/* Block Actions */}
          <div className="absolute top-2 right-2">
            <BlockActions
              onDelete={() => {
                onRemove(block.id);
                onConsumeFocus();
              }}
            />
          </div>

          <BlockRenderer
            autoFocus={block.id === activeBlockId}
            block={block}
            onUpdateMeta={onUpdateMeta}
            onUpdateConfig={onUpdateConfig}
          />
        </div>
      ))}
    </div>
  );
}
