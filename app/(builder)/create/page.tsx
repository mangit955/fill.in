"use client";

import { useFormEditor } from "@/lib/editor/useFormEditor";
import BuilderCanvas from "@/components/builder/BuilderCanvas";

export default function CreatePage() {
  const editor = useFormEditor();

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-xl font-semibold mb-6">Form Builder</h1>

      <BuilderCanvas
        blocks={editor.blocks}
        onUpdateMeta={editor.updateMeta}
        onUpdateConfig={editor.updateConfig}
      />
    </div>
  );
}
