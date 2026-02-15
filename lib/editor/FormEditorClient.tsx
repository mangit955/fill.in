"use client";

import { useFormEditor } from "@/lib/editor/useFormEditor";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import AddBlockPanel from "@/components/builder/AddBlockPanel";
import {
  createDateBlock,
  createEmailBlock,
  createFileUploadBlock,
  createLinearScaleBlock,
  createLinkBlock,
  createLongTextBlock,
  createMultipleChoiceBlock,
  createNumberBlock,
  createPhoneBlock,
  createRatingBlock,
  createShortTextBlock,
  createTimeBlock,
} from "@/lib/forms/defaults";
import { useEffect, useState, useRef } from "react";
import { Form, FormBlock } from "@/lib/forms/types";
import { NavbarApp } from "@/components/navbar/navbarApp";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Preview } from "@/components/builder/PreviewDialog";
import { supabase } from "../supabase/client";
import AuthModal from "@/app/auth/authModal";
import { NavbarHome } from "@/components/navbar/navbarHome";

type Props = {
  initialForm: Form;
  formId: string;
  isOwner: boolean;
};

export default function FormEditorClient({
  initialForm,
  formId,
  isOwner,
}: Props) {
  const editor = useFormEditor(initialForm);
  const [mode, setMode] = useState<"editor" | "published">("editor");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  async function continuePublish() {
    console.log("[Publish Flow] continuePublish called");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.log("[Publish Flow] No session, aborting");
      return;
    }

    try {
      setIsPublishing(true);
      console.log("[Publish Flow] Calling editor.publish()...");

      const slug = await editor.publish();
      console.log("[Publish Flow] Published! Slug:", slug);
      const url = `${window.location.origin}/f/${slug}`;

      setPublishedUrl(url);
      setMode("published");
    } catch (error) {
      console.error("[Publish Flow] Error:", error);
      toast.error("Failed to publish form");
    } finally {
      setIsPublishing(false);
    }
  }
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const updateConfig = editor.updateConfig;
  const updateMeta = editor.updateMeta;
  const remove = editor.remove;
  const duplicate = editor.duplicate;
  const reorder = editor.reorder;

  function addAndFocus(create: () => FormBlock) {
    const block = create();
    editor.add(block);
    setActiveBlockId(block.id);
  }

  useDebouncedEffect(
    () => {
      editor.saveDraft();
    },
    [editor.form],
    2500,
  );

  // Resume publish after OAuth redirect
  useEffect(() => {
    const check = async () => {
      const pending = localStorage.getItem("pendingPublish");
      console.log("[Publish Flow] Checking pendingPublish:", pending);
      if (!pending) return;

      // Wait a bit for session to be fully established after OAuth redirect
      await new Promise((resolve) => setTimeout(resolve, 300));

      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(
        "[Publish Flow] Session:",
        session?.user ? "User logged in" : "No user",
      );

      if (session?.user) {
        console.log("[Publish Flow] Resuming publish...");
        localStorage.removeItem("pendingPublish");
        await continuePublish();
      } else {
        console.log(
          "[Publish Flow] No session yet, will retry via auth state change listener",
        );
      }
    };

    check();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.log("[Publish Flow] Auth state changed:", event);
        if (event === "SIGNED_IN") {
          const pending = localStorage.getItem("pendingPublish");
          console.log(
            "[Publish Flow] SIGNED_IN event, pending:",
            pending,
            "authOpen:",
            authOpen,
          );

          if (pending) {
            setAuthOpen(false);
            localStorage.removeItem("pendingPublish");
            setTimeout(() => {
              continuePublish();
            }, 200);
          }
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [authOpen]);

  useEffect(() => {
    if (!descRef.current) return;
    const el = descRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [editor.form.description]);

  if (mode === "published" && publishedUrl) {
    return (
      <div>
        <NavbarHome />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-xl text-left space-y-6">
            <h1 className="text-xl font-semibold">Share Link </h1>
            <h2 className="text-muted-foreground">
              Your form is now published and ready to be shared with the world!
              Copy this link to share your form on social media, messaging apps
              or via email.
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
                  toast.success("Link has been copied!", { duration: 1500 });
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
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top navbar */}
      <NavbarApp
        isPublishing={isPublishing}
        isOwner={isOwner}
        onPublish={async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.user) {
            localStorage.setItem("pendingPublish", "true");
            setAuthOpen(true);
            return;
          }

          await continuePublish();
        }}
        onPreview={async () => setPreviewOpen(true)}
        formId={formId}
      />

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={async () => {
          setAuthOpen(false);
        }}
      />

      {/* Scrollable editor area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-10">
          <input
            value={editor.form.title}
            onChange={(e) => editor.updateFormMeta({ title: e.target.value })}
            placeholder="Form Title"
            className="text-6xl md:text-8xl font-bold text-neutral-700 placeholder:text-neutral-300 mb-6 w-full bg-transparent outline-none border-none"
          />

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
            onAddEmail={() => addAndFocus(createEmailBlock)}
            onAddPhone={() => addAndFocus(createPhoneBlock)}
            onAddDate={() => addAndFocus(createDateBlock)}
            onAddLink={() => addAndFocus(createLinkBlock)}
            onAddNumber={() => addAndFocus(createNumberBlock)}
            onAddRating={() => addAndFocus(createRatingBlock)}
            onAddFileUpload={() => addAndFocus(createFileUploadBlock)}
            onAddTime={() => addAndFocus(createTimeBlock)}
            onAddLinearScale={() => addAndFocus(createLinearScaleBlock)}
          />

          <BuilderCanvas
            blocks={editor.blocks}
            hydrated={editor.hydrated}
            activeBlockId={activeBlockId}
            onUpdateMeta={updateMeta}
            onUpdateConfig={updateConfig}
            onRemove={remove}
            onDuplicate={duplicate}
            onConsumeFocus={() => setActiveBlockId(null)}
            onReorder={reorder}
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
    </div>
  );
}
