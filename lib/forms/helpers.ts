// What is this file REALLY?

// This is your block state reducer layer.
// Not React-specific.
// Not UI-specific.
// It answers:
// “Given current blocks, and an intent, what is the next valid state?”

import { FormBlock } from "@/app/api/forms/types";

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
