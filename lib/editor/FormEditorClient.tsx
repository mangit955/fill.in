"use client";

import { useFormEditor } from "@/lib/editor/useFormEditor";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import AddBlockPanel from "@/components/builder/AddBlockPanel";
import {
  createLongTextBlock,
  createMultipleChoiceBlock,
  createShortTextBlock,
} from "@/lib/forms/defaults";
import { useEffect, useState } from "react";
import { Form, FormBlock } from "@/lib/forms/types";
import { NavbarApp } from "@/components/navbar/navbarApp";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import { title } from "process";

type Props = {
  initialForm: Form;
};

export default function FormEditorClient({ initialForm }: Props) {
  const editor = useFormEditor(initialForm);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  function addAndFocus(create: () => FormBlock) {
    const block = create();
    editor.add(block);
    setActiveBlockId(block.id);
  }

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [editor.form]);

  useDebouncedEffect(
    () => {
      if (!hasUnsavedChanges) return;

      editor.saveDraft().then(() => {
        setHasUnsavedChanges(false);
        console.log("Autosaved");
      });
    },
    [hasUnsavedChanges, editor.form],
    1500
  );

  return (
    <div>
      <NavbarApp
        isPublishing={isPublishing}
        onPublish={async () => {
          try {
            setIsPublishing(true);
            const slug = await editor.publish();
            window.open(`/f/${slug}`, "_blank");
          } finally {
            setIsPublishing(false);
          }
        }}
      />

      <div className="max-w-3xl mx-auto py-10">
        <input
          value={editor.form.title}
          onChange={(e) => editor.updateFormMeta({ title: e.target.value })}
          placeholder="Form Title"
          className="text-6xl md:text-8xl font-bold text-neutral-700 placeholder:text-neutral-300 mb-6 w-full bg-transparent outline-none border-none"
        ></input>

        <AddBlockPanel
          onAddShortText={() => addAndFocus(createShortTextBlock)}
          onAddLongText={() => addAndFocus(createLongTextBlock)}
          onAddMultipleChoice={() => addAndFocus(createMultipleChoiceBlock)}
        />

        <BuilderCanvas
          blocks={editor.blocks}
          hydrated={editor.hydrated}
          activeBlockId={activeBlockId}
          onUpdateMeta={editor.updateMeta}
          onUpdateConfig={editor.updateConfig}
          onRemove={editor.remove}
          onDuplicate={editor.duplicate}
          onConsumeFocus={() => setActiveBlockId(null)}
          onReorder={editor.reorder}
          visibilityRules={editor.visibilityRules}
          onRemoveVisibilityRule={editor.removeVisibilityRule}
          onUpsertVisibilityRule={editor.upsertVisibilityRule}
          logicJumps={editor.logicJumps}
          onAddLogicJump={editor.addLogicJump}
          onRemoveLogicJump={editor.removeLogicJump}
          onUpdateLogicJump={editor.updateLogicJump}
        />
      </div>
    </div>
  );
}
