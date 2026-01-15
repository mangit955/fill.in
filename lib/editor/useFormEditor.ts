"use client";
import { Form, FormBlock } from "@/lib/forms/types";
import { useEffect, useMemo, useState } from "react";
import {
  addBlock,
  deleteBlock,
  insertBlockAfter,
  reorderBlock,
  updateBlockConfig,
  updateBlockMeta,
} from "../forms/helpers";
import { createEmptyForm } from "../forms/defaults";
import { debounce } from "../utils/debounce";

const STORAGE_KEY = "form_draft_v1";
function loadDraft() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useFormEditor(initialForm?: Form) {
  const [form, setForm] = useState<Form>(() => {
    return loadDraft() ?? initialForm ?? createEmptyForm();
  });
  const [hydrated, setHydrated] = useState(false);

  function persist(form: Form) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }

  useEffect(() => {
    setHydrated(true);
  }, []);

  const debouncePersist = useMemo(() => debounce(persist, 500), []);

  useEffect(() => {
    debouncePersist(form);
  }, [form, debouncePersist]);

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

  function duplicate(blockId: string) {
    setForm((prev) => {
      const source = prev.blocks.find((b) => b.id === blockId);
      if (!source) return prev;

      const cloned = {
        ...source,
        id: crypto.randomUUID(),
        config: structuredClone(source.config),
      };

      return {
        ...prev,
        blocks: insertBlockAfter(prev.blocks, blockId, cloned),
      };
    });
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
    duplicate,
    add,
    hydrated,
    remove,
    updateMeta,
    updateConfig,
    reorder,
  };
}
