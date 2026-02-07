"use client";

import { ReactNode } from "react";

type Props = {
  label: string; // text inside tooltip
  children: ReactNode; // element that triggers tooltip (icon, text, etc.)
  className?: string; // optional positioning tweaks
};

export default function TooltipHint({ label, children, className }: Props) {
  return (
    <span className={`relative inline-flex group ${className ?? ""}`}>
      {children}

      <span
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-1
          whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white
          opacity-0 translate-y-1 pointer-events-none
          transition-all duration-200 ease-out
          group-hover:opacity-100 group-hover:translate-y-0
        "
      >
        {label}
      </span>
    </span>
  );
}
