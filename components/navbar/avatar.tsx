"use client";

import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FillinLogo } from "../ui/svg/logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  user: User;
};

export function NavbarAvatar({ user }: Props) {
  const [avatarError, setAvatarError] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [canShowTooltip, setCanShowTooltip] = useState(true);
  const avatarUrl = user?.user_metadata?.avatar_url?.split("=")[0] || null;

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={(open) => {
        setMenuOpen(open);
        setTooltipOpen(false);
        if (!open) {
          setCanShowTooltip(false);
        }
      }}
    >
      <Tooltip
        open={!menuOpen && canShowTooltip && tooltipOpen}
        onOpenChange={(open) => {
          if (!menuOpen && canShowTooltip) setTooltipOpen(open);
        }}
      >
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              onClick={() => setTooltipOpen(false)}
              onMouseLeave={() => setCanShowTooltip(true)}
              className="h-8 w-8 rounded-full overflow-hidden border cursor-pointer bg-gray-100"
            >
              {avatarUrl && !avatarError ? (
                <Image
                  src={avatarUrl}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm font-semibold text-neutral-600">
                  {user.email?.[0]?.toUpperCase()}
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent className="font-semibold">More options</TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align="end"
        className="w-44"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 cursor-pointer text-gray-600"
          >
            <FillinLogo className="text-gray-400 group-hover:text-gray-700" />
            Home
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 cursor-pointer text-gray-600"
          >
            <FileTextIcon
              size={16}
              className="text-gray-400 group-hover:text-gray-700"
            />
            My forms
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }}
          className="group flex items-center gap-2 cursor-pointer text-gray-600"
        >
          <LogOutIcon
            size={16}
            className="text-gray-400 group-hover:text-gray-700"
          />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
