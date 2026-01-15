"use client";

import { FormBlock } from "@/lib/forms/types";
import BlockRenderer from "./BuilderRenderer";

import { Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  onDuplicate: (blockId: string) => void;
};

export default function BuilderCanvas({
  blocks,
  hydrated,
  onUpdateMeta,
  onUpdateConfig,
  activeBlockId,
  onRemove,
  onConsumeFocus,
  onDuplicate,
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
      <div className="min-h-[400px] border border-dashed border-gray-300 rounded-md p-6">
        <p className="text-muted-foreground text-sm text-center pt-40">
          No fields yet. Add a block to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      {blocks.map((block) => (
        <div key={block.id} className="relative">
          {/* interactions button */}
          <div className="absolute left-2  translate-y-0 top-[40%]  flex gap-3 items-center text-neutral-400">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    onRemove(block.id);
                    onConsumeFocus();
                  }}
                  className="cursor-pointer"
                >
                  <div className=" cursor-pointer rounded-sm hover:text-neutral-600 hover:bg-gray-100 p-1">
                    <Trash2 size={18} />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete this block</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onDuplicate(block.id)}
                  className=" left-2 -translate-x-1/2 px-2"
                >
                  <div className=" cursor-pointer text-neutral-400 rounded-sm hover:text-neutral-600 hover:bg-gray-100 p-1">
                    <Plus size={18} />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert block below</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Block Content */}
          <div className="pl-18 right-2">
            <BlockRenderer
              autoFocus={block.id === activeBlockId}
              block={block}
              onUpdateMeta={onUpdateMeta}
              onUpdateConfig={onUpdateConfig}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
