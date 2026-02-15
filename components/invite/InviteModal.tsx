"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserStar } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formId: string;
  canInvite: boolean; // owner only
};

export default function InviteModal({
  open,
  onOpenChange,
  formId,
  canInvite,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function invite() {
    if (!email || !canInvite) return;

    setLoading(true);

    const promise = fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, formId }),
    }).then(async (res) => {
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Invite failed");
      }

      return data;
    });

    toast.promise(promise, {
      loading: "Inviting collaborator…",
      success: "Invite sent",
      error: (err) => err.message,
    });

    try {
      await promise; // ← WAIT here
      setEmail("");
      onOpenChange(false); // close AFTER request completes
      router.refresh();
    } catch {
      // do nothing, toast already handled
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 p-1 rounded-md">
            <UserStar className="text-gray-700" />
          </span>
          <h2 className="text-xl text-neutral-800 font-semibold">
            Invite collaborator
          </h2>
        </div>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full border focus:outline-none border-gray-300 shadow-sm rounded-md px-3 py-2 text-sm"
        />
        {!canInvite && (
          <p className="text-xs text-neutral-500">
            Only the owner can invite collaborators
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>

          <Button
            onClick={invite}
            disabled={loading || !canInvite}
            variant="default"
            className="bg-black! min-w-[100px] hover:bg-black/80!"
          >
            {loading ? <Spinner height={20} width={20} /> : "Send invite"}
          </Button>
        </div>
      </div>
    </div>
  );
}
