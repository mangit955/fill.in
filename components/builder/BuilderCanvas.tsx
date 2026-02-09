"use client";

import { FormBlock, LogicJump, VisibilityRule } from "@/lib/forms/types";
import BlockRenderer from "./BuilderRenderer";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import EmptyState from "./EmptyState";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlockItem } from "./SortableBlockItem";
import BlockShell from "./BlockShell";

type BuilderCanvasProps = {
  blocks: FormBlock[];
  hydrated: boolean;
  activeBlockId: string | null;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: <T extends FormBlock>(
    blockId: string,
    updater: (config: T["config"]) => T["config"],
  ) => void;
  onRemove: (blockId: string) => void;
  onConsumeFocus: () => void;
  onDuplicate: (blockId: string) => void;
  onReorder: (from: number, to: number) => void;
  visibilityRules: VisibilityRule[];
  onUpsertVisibilityRule: (rule: VisibilityRule) => void;
  onRemoveVisibilityRule: (targetBlockId: string) => void;
  logicJumps: LogicJump[];
  onAddLogicJump: (jump: LogicJump) => void;
  onUpdateLogicJump: (
    jumpId: string,
    updates: Partial<Omit<LogicJump, "id">>,
  ) => void;
  onRemoveLogicJump: (jumpId: string) => void;
  onSetActive?: (blockId: string) => void;
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
  onReorder,
  visibilityRules,
  onRemoveVisibilityRule,
  onUpsertVisibilityRule,
  logicJumps,
  onAddLogicJump,
  onRemoveLogicJump,
  onUpdateLogicJump,
  onSetActive,
}: BuilderCanvasProps) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);

    onReorder(oldIndex, newIndex);
    onConsumeFocus();
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!activeBlockId) return;

      if (e.key === "Backspace") {
        const activeEl = document.activeElement as HTMLElement | null;

        // If user is typing inside an input/textarea/contenteditable
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.isContentEditable)
        ) {
          const input = activeEl as HTMLInputElement | HTMLTextAreaElement;

          const value = (input.value ?? "").toString();
          const start = input.selectionStart ?? 0;
          const end = input.selectionEnd ?? 0;

          const isEmpty = value.length === 0;
          const caretAtStart = start === 0 && end === 0;

          // If there's still text → normal backspace
          if (!isEmpty) return;

          // If empty but cursor not at start → normal backspace
          if (!caretAtStart) return;

          // At this point:
          // empty + caret at start → delete block
          e.preventDefault();
        }

        const index = blocks.findIndex((b) => b.id === activeBlockId);
        if (index === -1) return;

        onRemove(activeBlockId);

        const prev = blocks[index - 1];
        if (prev) onSetActive?.(prev.id);
        else onConsumeFocus();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeBlockId, onRemove, onConsumeFocus, blocks, onSetActive]);

  // 1️ Before hydration: render neutral shell
  if (!hydrated) {
    return (
      <div className="min-h-[400px] border border-dashed rounded-md p-6" />
    );
  }

  // 2️ After hydration: real UI decisions
  if (blocks.length === 0) {
    return <EmptyState />;
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 transition-all duration-200">
          {blocks.map((block) => (
            <SortableBlockItem id={block.id} key={block.id}>
              {({ setNodeRef, attributes, listeners, style, isDragging }) => (
                <div
                  ref={setNodeRef}
                  style={style}
                  className={`group relative transition-all duration-200 ease-out ${
                    isDragging
                      ? "opacity-80 scale-[0.98]"
                      : "opacity-100 scale-100"
                  }`}
                  onClick={() => onSetActive?.(block.id)}
                >
                  {" "}
                  <BlockShell
                    block={block}
                    blocks={blocks}
                    visibilityRules={visibilityRules}
                    onRemoveRule={onRemoveVisibilityRule}
                    onUpsertRule={onUpsertVisibilityRule}
                    logicJumps={logicJumps}
                    onAddLogicJump={onAddLogicJump}
                    onRemoveLogicJump={onRemoveLogicJump}
                    onUpdateLogicJump={onUpdateLogicJump}
                  >
                    {/* Actions + handle */}
                    <div
                      className={`absolute left-2 top-[30%] flex items-center transition-opacity duration-150 ${
                        activeBlockId === block.id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {/* Delete */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              onRemove(block.id);
                              onConsumeFocus();
                            }}
                            className="cursor-pointer text-neutral-400 hover:text-neutral-600 hover:bg-gray-100 p-1 rounded-md"
                          >
                            <Trash2 size={18} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">
                          Delete block
                        </TooltipContent>
                      </Tooltip>

                      {/* Duplicate */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onDuplicate(block.id)}
                            className="cursor-pointer text-neutral-400 hover:text-neutral-600 hover:bg-gray-100 p-1 rounded-md"
                          >
                            <Plus size={18} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">
                          Insert block below
                        </TooltipContent>
                      </Tooltip>

                      {/* Drag handle */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab text-neutral-400 hover:text-neutral-600 hover:bg-gray-100 p-1 rounded-md"
                          >
                            <GripVertical size={16} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">
                          Drag <span className="text-neutral-400">to move</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Block content */}
                    <div className="pl-22">
                      <BlockRenderer
                        autoFocus={block.id === activeBlockId}
                        block={block}
                        onUpdateMeta={onUpdateMeta}
                        onUpdateConfig={onUpdateConfig}
                      />
                    </div>
                  </BlockShell>
                </div>
              )}
            </SortableBlockItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
