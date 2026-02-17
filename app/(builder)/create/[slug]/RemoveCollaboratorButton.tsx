"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleMinus } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function RemoveCollaboratorButton() {
  const { pending } = useFormStatus();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      aria-label={pending ? "Removing collaborator" : "Remove collaborator"}
      className="cursor-pointer text-neutral-300 hover:text-neutral-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-neutral-200"
    >
          <CircleMinus size={18} />
        </button>
      </TooltipTrigger>
      <TooltipContent>Remove</TooltipContent>
    </Tooltip>
  );
}
