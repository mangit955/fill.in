"use client";

import { Form, FormBlock, LogicJump, VisibilityRule } from "@/lib/forms/types";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
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
    const data = JSON.parse(raw) as Form;

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
  const hydrated = true;
  const [isDirty, setIsDirty] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  function persist(form: Form) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }

  const debouncePersist = useMemo(() => debounce(persist, 1500), []);

  useEffect(() => {
    debouncePersist(form);
  }, [form, debouncePersist]);

  function updateForm(updater: (prev: Form) => Form) {
    setIsDirty(true);
    setForm((prev) => updater(prev));
  }

  //Intent APIs

  function add(block: FormBlock) {
    updateForm((prev) => ({
      ...prev,
      blocks: addBlock(prev.blocks, block),
    }));
  }

  function remove(blockId: string) {
    updateForm((prev) => ({
      ...prev,
      blocks: deleteBlock(prev.blocks, blockId),
    }));
  }

  function duplicate(blockId: string) {
    updateForm((prev) => {
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
    updates: Partial<Pick<FormBlock, "required">>,
  ) {
    updateForm((prev) => ({
      ...prev,
      blocks: updateBlockMeta(prev.blocks, blockId, updates),
    }));
  }

  function updateConfig<T extends FormBlock>(
    blockId: string,
    updater: (config: T["config"]) => T["config"],
  ) {
    updateForm((prev) => ({
      ...prev,
      blocks: updateBlockConfig(prev.blocks, blockId, updater),
    }));
  }

  function reorder(fromIndex: number, toIndex: number) {
    updateForm((prev) => ({
      ...prev,
      blocks: reorderBlock(prev.blocks, fromIndex, toIndex),
    }));
  }

  function upsertVisibility(rule: VisibilityRule) {
    updateForm((prev) => ({
      ...prev,
      visibilityRules: upsertVisibilityRule(prev.visibilityRules, rule),
    }));
  }

  function removeVisibility(targetBlockId: string) {
    updateForm((prev) => ({
      ...prev,
      visibilityRules: removeVisibilityRule(
        prev.visibilityRules,
        targetBlockId,
      ),
    }));
  }

  function addJump(jump: LogicJump) {
    updateForm((prev) => ({
      ...prev,
      logicJumps: addLogicJump(prev.logicJumps, jump),
    }));
  }

  function updateJump(jumpId: string, updates: Partial<Omit<LogicJump, "id">>) {
    updateForm((prev) => ({
      ...prev,
      logicJumps: updateLogicJump(prev.logicJumps, jumpId, updates),
    }));
  }

  function removeJump(jumpId: string) {
    updateForm((prev) => ({
      ...prev,
      logicJumps: removeLogicJump(prev.logicJumps, jumpId),
    }));
  }

  async function saveDraft() {
    if (!isDirty) return;
    setIsDirty(false);
    // Don't overwrite status - just update the schema and metadata
    const payload = {
      id: form.id,
      slug: form.slug ?? form.id,
      title: form.title ?? "Untitled",
      description: form.description ?? "",
      schema: form,
    };

    const { error } = await supabase.from("forms").upsert(payload).select();

    if (error) {
      alert("Save failed");

      return;
    }
  }

  async function publish() {
    if (!user) throw new Error("NOT_LOGGED_IN");

    const { error } = await supabase
      .from("forms")
      .update({
        status: "published",
        schema: form,
      })
      .eq("id", form.id);

    if (error) throw error;

    return form.slug;
  }

  function updateFormMeta(
    updates: Partial<Pick<Form, "title" | "description">>,
  ) {
    updateForm((prev) => ({
      ...prev,
      ...updates,
    }));
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
    updateFormMeta,

    upsertVisibilityRule: upsertVisibility,
    removeVisibilityRule: removeVisibility,

    addLogicJump: addJump,
    updateLogicJump: updateJump,
    removeLogicJump: removeJump,
  };
}
