"use client";

import { Form, FormBlock, LogicJump, VisibilityRule } from "@/lib/forms/types";
import { useEffect, useMemo, useState } from "react";
import {
  addBlock,
  addLogicJump,
  deleteBlock,
  insertBlockAfter,
  removeLogicJump,
  removeVisibilityRule,
  reorderBlock,
  updateBlockConfig,
  updateBlockMeta,
  updateLogicJump,
  upsertVisibilityRule,
} from "../forms/helpers";
import { createEmptyForm } from "../forms/defaults";
import { debounce } from "../utils/debounce";
import { supabase } from "@/lib/supabase/client";

const STORAGE_KEY = "form_draft_v1";
function loadDraft() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    const data = JSON.parse(raw);

    return {
      ...data,
      visibilityRules: data.visibilityRules ?? [],
      logicJumps: data.logicJumps ?? [],
    };
  } catch {
    return null;
  }
}

export function useFormEditor(initialForm?: Form) {
  const [form, setForm] = useState<Form>(() => {
    return initialForm ?? loadDraft() ?? createEmptyForm();
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

      const cloned: FormBlock = structuredClone(source);
      cloned.id = crypto.randomUUID();

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

  function upsertVisibility(rule: VisibilityRule) {
    setForm((prev) => ({
      ...prev,
      visibilityRules: upsertVisibilityRule(prev.visibilityRules, rule),
    }));
  }

  function removeVisibility(targetBlockId: string) {
    setForm((prev) => ({
      ...prev,
      visibilityRules: removeVisibilityRule(
        prev.visibilityRules,
        targetBlockId
      ),
    }));
  }

  function addJump(jump: LogicJump) {
    setForm((prev) => ({
      ...prev,
      logicJumps: addLogicJump(prev.logicJumps, jump),
    }));
  }

  function updateJump(jumpId: string, updates: Partial<Omit<LogicJump, "id">>) {
    setForm((prev) => ({
      ...prev,
      logicJumps: updateLogicJump(prev.logicJumps, jumpId, updates),
    }));
  }

  function removeJump(jumpId: string) {
    setForm((prev) => ({
      ...prev,
      logicJumps: removeLogicJump(prev.logicJumps, jumpId),
    }));
  }

  async function saveDraft() {
    console.log("saving draft", form);

    const payload = {
      id: form.id,
      slug: form.slug ?? form.id,
      title: form.title ?? "Untitled",
      description: form.description ?? "",
      schema: form,
      status: "draft",
    };

    console.log("payload →", payload);

    const { data, error } = await supabase
      .from("forms")
      .upsert(payload)
      .select();

    console.log("supabase data →", data);
    console.log("supabase error →", error);

    if (error) {
      alert("Save failed");
      console.error(error);
      return;
    }
  }

  async function publish() {
    const { error } = await supabase
      .from("forms")
      .update({ status: "published", schema: form })
      .eq("id", form.id);

    if (error) throw error;

    return form.slug;
  }

  return {
    form,
    blocks: form.blocks,
    visibilityRules: form.visibilityRules,
    logicJumps: form.logicJumps,

    duplicate,
    add,
    hydrated,
    remove,
    updateMeta,
    updateConfig,
    reorder,
    saveDraft,
    publish,

    upsertVisibilityRule: upsertVisibility,
    removeVisibilityRule: removeVisibility,

    addLogicJump: addJump,
    updateLogicJump: updateJump,
    removeLogicJump: removeJump,
  };
}
