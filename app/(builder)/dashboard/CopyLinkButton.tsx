"use client";

import { useState } from "react";
import { Check, Link } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  slug: string;
};

export default function CopyLinkButton({ slug }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/f/${slug}`;

    await navigator.clipboard.writeText(url);

    setCopied(true);
    toast.success("Link copied!", { duration: 1500 });
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 cursor-pointer text-neutral-500 hover:text-neutral-600 hover:bg-gray-200 p-1 rounded-md focus:outline-none
focus-visible:ring-4 focus-visible:ring-blue-300
active:ring-4 active:ring-blue-300"
          >
            {copied ? <Check size={16} /> : <Link size={16} />}
          </button>
        </TooltipTrigger>
        <TooltipContent className="font-bold">
          Copy link to share
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
