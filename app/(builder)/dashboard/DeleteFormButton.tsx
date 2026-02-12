"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteFormButton() {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              const ok = confirm(
                "Are you sure you want to delete this form? This cannot be undone.",
              );
              if (!ok) return;
              setLoading(true);

              const form = (e.currentTarget as HTMLButtonElement).closest(
                "form",
              );
              form?.requestSubmit();
            }}
            className="cursor-pointer focus:outline-none
      focus-visible:ring-4 focus-visible:ring-blue-200
      active:ring-4 active:ring-blue-200
      text-neutral-500 hover:text-neutral-600
      hover:bg-gray-200 p-1 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <Spinner width={20} height={20} />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="font-bold">Delete</TooltipContent>
      </Tooltip>
    </div>
  );
}
