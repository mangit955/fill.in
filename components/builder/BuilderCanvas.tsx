"use client";

import { FormBlock, LogicJump, VisibilityRule } from "@/lib/forms/types";
import BlockRenderer from "./BuilderRenderer";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useMemo, useRef } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlockItem } from "./SortableBlockItem";
import BlockShell from "./BlockShell";
import React from "react";

const MemoBlockItem = React.memo(function MemoBlockItem({
  block,
  blocks,
  activeBlockId,
  visibilityRules,
  logicJumps,
  onRemove,
  onDuplicate,
  onUpdateMeta,
  onUpdateConfig,
  onConsumeFocus,
  onSetActive,
  onRemoveVisibilityRule,
  onUpsertVisibilityRule,
  onAddLogicJump,
  onRemoveLogicJump,
  onUpdateLogicJump,
}: {
  block: FormBlock;
  blocks: FormBlock[];
  activeBlockId: string | null;
  visibilityRules: VisibilityRule[];
  logicJumps: LogicJump[];
  onRemove: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: <T extends FormBlock>(
    blockId: string,
    updater: (config: T["config"]) => T["config"],
  ) => void;
  onConsumeFocus: () => void;
  onSetActive?: (blockId: string) => void;
  onRemoveVisibilityRule: (targetBlockId: string) => void;
  onUpsertVisibilityRule: (rule: VisibilityRule) => void;
  onAddLogicJump: (jump: LogicJump) => void;
  onRemoveLogicJump: (jumpId: string) => void;
  onUpdateLogicJump: (
    jumpId: string,
    updates: Partial<Omit<LogicJump, "id">>,
  ) => void;
}) {
  return (
    <SortableBlockItem id={block.id}>
      {({ setNodeRef, attributes, listeners, style, isDragging }) => (
        <div
          ref={setNodeRef}
          style={style}
          className={`group relative transition-all duration-200 ease-out ${
            isDragging ? "opacity-80 scale-[0.98]" : ""
          }`}
          onClick={() => onSetActive?.(block.id)}
        >
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
            <div
              className={`absolute left-2 top-[30%] flex items-center transition-opacity duration-150 ${
                activeBlockId === block.id
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {/* Delete */}
              <button
                onClick={() => {
                  onRemove(block.id);
                  onConsumeFocus();
                }}
                className="cursor-pointer text-neutral-400 hover:text-neutral-600 hover:bg-gray-100 p-1 rounded-md"
              >
                <Trash2 size={18} />
              </button>

              {/* Duplicate */}
              <button
                onClick={() => onDuplicate(block.id)}
                className="cursor-pointer text-neutral-400 hover:text-neutral-600 hover:bg-gray-100 p-1 rounded-md"
              >
                <Plus size={18} />
              </button>

              {/* Drag */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab text-neutral-400 hover:text-neutral-600 hover:bg-gray-100 p-1 rounded-md"
              >
                <GripVertical size={16} />
              </div>
            </div>

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
  );
});

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
  const blocksRef = useRef(blocks);
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);

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

        const index = blocksRef.current.findIndex(
          (b) => b.id === activeBlockId,
        );
        if (index === -1) return;

        onRemove(activeBlockId);

        const prev = blocksRef.current[index - 1];
        if (prev) onSetActive?.(prev.id);
        else onConsumeFocus();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeBlockId]);

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
      <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 transition-all duration-200">
          {blocks.map((block) => (
            <MemoBlockItem
              key={block.id}
              block={block}
              blocks={blocks}
              activeBlockId={activeBlockId}
              visibilityRules={visibilityRules}
              logicJumps={logicJumps}
              onRemove={onRemove}
              onDuplicate={onDuplicate}
              onUpdateMeta={onUpdateMeta}
              onUpdateConfig={onUpdateConfig}
              onConsumeFocus={onConsumeFocus}
              onSetActive={onSetActive}
              onRemoveVisibilityRule={onRemoveVisibilityRule}
              onUpsertVisibilityRule={onUpsertVisibilityRule}
              onAddLogicJump={onAddLogicJump}
              onRemoveLogicJump={onRemoveLogicJump}
              onUpdateLogicJump={onUpdateLogicJump}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
