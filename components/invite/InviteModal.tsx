"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formId: string;
};

export default function InviteModal({ open, onOpenChange, formId }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function invite() {
    if (!email) return;

    try {
      setLoading(true);

      const res = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, formId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Invite failed");
        return;
      }

      setEmail("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Invite collaborator</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-3 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={invite}
            disabled={loading}
            className="px-3 py-2 text-sm rounded-md bg-black text-white disabled:opacity-50"
          >
            {loading ? "Inviting..." : "Send invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
