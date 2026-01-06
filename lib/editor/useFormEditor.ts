import { Form, FormBlock } from "@/app/api/forms/types";
import { useState } from "react";
import {
  addBlock,
  deleteBlock,
  reorderBlock,
  updateBlockConfig,
  updateBlockMeta,
} from "../forms/helpers";
import { createEmptyForm } from "@/app/api/forms/defaults";

// Hooks//
export function useFormEditor(initialForm?: Form) {
  const [form, setForm] = useState<Form>(initialForm ?? createEmptyForm());

  //Intent APIs

  function add(block: FormBlock) {
    setForm((prev) => ({
      ...prev,
      blocks: addBlock(prev.blocks, block),
    }));
  }

  function remove(blockId: string) {
    setForm((prev) => ({
      ...prev,
      blocks: deleteBlock(prev.blocks, blockId),
    }));
  }

  function updateMeta(
    blockId: string,
    updates: Partial<Pick<FormBlock, "required">>
  ) {
    setForm((prev) => ({
      ...prev,
      blocks: updateBlockMeta(prev.blocks, blockId, updates),
    }));
  }

  function updateConfig<T extends FormBlock>(
    blockId: string,
    updater: (config: T["config"]) => T["config"]
  ) {
    setForm((prev) => ({
      ...prev,
      blocks: updateBlockConfig(prev.blocks, blockId, updater),
    }));
  }

  function reorder(fromIndex: number, toIndex: number) {
    setForm((prev) => ({
      ...prev,
      blocks: reorderBlock(prev.blocks, fromIndex, toIndex),
    }));
  }

  return {
    form,
    blocks: form.blocks,
    add,
    remove,
    updateMeta,
    updateConfig,
    reorder,
  };
}
