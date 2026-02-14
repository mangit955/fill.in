"use client";

import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, LayoutDashboardIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  user: any;
  avatarError: boolean;
  setAvatarError: React.Dispatch<React.SetStateAction<boolean>>;
};

export function NavbarAvatar({ user }: Props) {
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = user?.user_metadata?.avatar_url?.split("=")[0] || null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 rounded-full overflow-hidden border cursor-pointer bg-gray-100">
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

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <LayoutDashboardIcon size={16} />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <FileTextIcon size={16} />
            My forms
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <LogOutIcon size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
