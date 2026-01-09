"use client";

import { useFormEditor } from "@/lib/editor/useFormEditor";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import AddBlockPanel from "@/components/builder/AddBlockPanel";
import {
  createLongTextBlock,
  createMultipleChoiceBlock,
  createShortTextBlock,
} from "@/lib/forms/defaults";
import { useState } from "react";
import { FormBlock } from "@/lib/forms/types";

export default function CreatePage() {
  const editor = useFormEditor();
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  function addAndFocus(create: () => FormBlock) {
    const block = create();
    editor.add(block);
    setFocusedBlockId(block.id);
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-xl font-semibold mb-6">Form Builder</h1>

      <AddBlockPanel
        onAddShortText={() => addAndFocus(createShortTextBlock)}
        onAddLongText={() => addAndFocus(createLongTextBlock)}
        onAddMultipleChoice={() => addAndFocus(createMultipleChoiceBlock)}
      />

      <BuilderCanvas
        blocks={editor.blocks}
        focusedBlockId={focusedBlockId}
        onUpdateMeta={editor.updateMeta}
        onUpdateConfig={editor.updateConfig}
        onConsumeFocus={() => setFocusedBlockId(null)}
      />
    </div>
  );
}
