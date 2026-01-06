import { FormBlock } from "@/app/api/forms/types";

export function addBlock(blocks: FormBlock[], block: FormBlock): FormBlock[] {
  return [...blocks, block];
}

//Update
export function updateBlockMeta(
  blocks: FormBlock[],
  blockId: string,
  updates: Partial<Pick<FormBlock, "required">>
): FormBlock[] {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, ...updates } : block
  );
}

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
