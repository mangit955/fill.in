"use client";

import { useFormEditor } from "@/lib/editor/useFormEditor";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import AddBlockPanel from "@/components/builder/AddBlockPanel";
import {
  createLongTextBlock,
  createMultipleChoiceBlock,
  createShortTextBlock,
} from "@/lib/forms/defaults";
import { useEffect, useState, useRef } from "react";
import { Form, FormBlock } from "@/lib/forms/types";
import { NavbarApp } from "@/components/navbar/navbarApp";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Preview } from "@/components/builder/PreviewDialog";

type Props = {
  initialForm: Form;
};

export default function FormEditorClient({ initialForm }: Props) {
  const editor = useFormEditor(initialForm);
  const [mode, setMode] = useState<"editor" | "published">("editor");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copied, setCopied] = useState(false);
  const descRef = useRef<HTMLTextAreaElement | null>(null);

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

  useEffect(() => {
    if (mode === "published") return;
    setPublishedUrl(null);
  }, [editor.form]);

  useEffect(() => {
    if (!descRef.current) return;
    const el = descRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [editor.form.description]);

  if (mode === "published" && publishedUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl text-left space-y-6">
          <h1 className="text-xl font-semibold">Share Link </h1>
          <h2 className="text-muted-foreground">
            Your form is now published and ready to be shared with the world!
            Copy this link to share your form on social media, messaging apps or
            via email.
          </h2>

          <div className="flex w-full items-center gap-3">
            <div className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 text-md bg-white whitespace-nowrap overflow-hidden text-ellipsis">
              {publishedUrl}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(publishedUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
                toast.success("Link has been copied!");
              }}
              className=" flex items-center gap-2 px-3 py-2 text-md border font-semibold rounded-md cursor-pointer bg-black text-white hover:bg-neutral-700 whitespace-nowrap"
            >
              {copied ? (
                <Check width={20} height={20} />
              ) : (
                <Copy width={20} height={20} />
              )}
              Copy
            </button>
          </div>

          <button
            onClick={() => setMode("editor")}
            className="text-sm border rounded-md px-2 py-1  cursor-pointer font-semibold text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 focus:ring-4 ring-blue-300 ˂"
          >
            ← Back to editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarApp
        isPublishing={isPublishing}
        onPublish={async () => {
          try {
            setIsPublishing(true);

            const slug = await editor.publish();

            const url = `${window.location.origin}/f/${slug}`;

            setPublishedUrl(url);
            setMode("published");
          } finally {
            setIsPublishing(false);
          }
        }}
        onPreview={async () => setPreviewOpen(true)}
      />

      <div className="max-w-3xl mx-auto py-10">
        <input
          value={editor.form.title}
          onChange={(e) => editor.updateFormMeta({ title: e.target.value })}
          placeholder="Form Title"
          className="text-6xl md:text-8xl font-bold text-neutral-700 placeholder:text-neutral-300 mb-6 w-full bg-transparent outline-none border-none"
        ></input>
        <textarea
          ref={descRef}
          value={editor.form.description}
          onChange={(e) => {
            editor.updateFormMeta({ description: e.target.value });
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
          placeholder="Description"
          rows={1}
          className="text-xl md:text-2xl font-medium text-neutral-500 placeholder:text-neutral-300 mb-6 w-full bg-transparent outline-none border-none resize-none overflow-hidden"
        />

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

        <Preview
          form={editor.form}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      </div>
    </div>
  );
}
