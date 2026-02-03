// What is this file REALLY?

// This is your block state reducer layer.
// Not React-specific.
// Not UI-specific.
// It answers:
// “Given current blocks, and an intent, what is the next valid state?”

import { FormBlock, LogicJump, VisibilityRule } from "@/lib/forms/types";
import { Target } from "lucide-react";

//addBlock => takes current block and returns a new array & appends a new block
export function addBlock(blocks: FormBlock[], block: FormBlock): FormBlock[] {
  return [...blocks, block];
}

//Update =>

// Pick<FormBlock, "required">
// Means:
// “Take ONLY the required field from FormBlock”

// Partial<...>
// Means:
// { required?: boolean }
//“This function is ONLY allowed to update metadata, and ONLY required.”

export function updateBlockMeta(
  blocks: FormBlock[],
  blockId: string,
  updates: Partial<Pick<FormBlock, "required">>
): FormBlock[] {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, ...updates } : block
  );
}

// What is <T extends FormBlock>?
// This means:  “T is some specific kind of FormBlock.”
// At call site, T might be: ShortTextBlock | LongTextBlock | MultipleChoiceBlock
// So T["config"] becomes: ShortTextConfig OR LongTextConfig OR MultipleChoiceConfig
// This is how you get config-specific typing.

//review this once more

export function updateBlockConfig<T extends FormBlock>(
  blocks: FormBlock[],
  blockId: string,
  updater: (config: T["config"]) => T["config"]
): FormBlock[] {
  return blocks.map((block) => {
    if (block.id !== blockId) return block;

    return {
      ...block,
      config: updater(block.config as T["config"]),
    };
  });
}

//Delete
export function deleteBlock(blocks: FormBlock[], blockId: string): FormBlock[] {
  return blocks.filter((block) => block.id !== blockId);
}

export function reorderBlock(
  blocks: FormBlock[],
  fromIndex: number,
  toIndex: number
): FormBlock[] {
  const next = [...blocks];

  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  return next;
}

export function cloneBlock(block: FormBlock): FormBlock {
  if (block.type === "multiple_choice") {
    return {
      ...block,
      id: crypto.randomUUID(),
      config: {
        ...block.config,
        options: block.config.options.map((o) => ({
          ...o,
          id: crypto.randomUUID(),
        })),
      },
    };
  }
  return {
    ...block,
    id: crypto.randomUUID(),
  };
}

export function insertBlockAfter(
  blocks: FormBlock[],
  afterId: string,
  newBlock: FormBlock
): FormBlock[] {
  const index = blocks.findIndex((b) => b.id === afterId);
  if (index === -1) return blocks;

  return [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
}

export function addLogicJump(jumps: LogicJump[], jump: LogicJump): LogicJump[] {
  return [...jumps, jump];
}

export function removeLogicJump(
  jumps: LogicJump[],
  jumpId: string
): LogicJump[] {
  return jumps.filter((j) => j.id !== jumpId);
}

export function updateLogicJump(
  jumps: LogicJump[],
  jumpId: string,
  updates: Partial<Omit<LogicJump, "id">>
): LogicJump[] {
  return jumps.map((j) => (j.id === jumpId ? { ...j, ...updates } : j));
}

export function upsertVisibilityRule(
  rules: VisibilityRule[],
  rule: VisibilityRule
): VisibilityRule[] {
  const existing = rules.find((r) => r.targetBlockId === rule.targetBlockId);

  if (!existing) {
    return [...rules, rule];
  }

  return rules.map((r) => (r.targetBlockId === rule.targetBlockId ? rule : r));
}

export function removeVisibilityRule(
  rules: VisibilityRule[],
  targetBlockId: string
): VisibilityRule[] {
  return rules.filter((r) => r.targetBlockId !== targetBlockId);
}
