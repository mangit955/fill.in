"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming you already have your button component

import { FillinLogo } from "../ui/svg/logo";
import { Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, LayoutDashboardIcon, FileTextIcon } from "lucide-react";

export const NavbarHome = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log("FULL USER:", data.user);
      console.log("METADATA:", data.user?.user_metadata);
      setUser(data.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      console.log("SESSION USER:", session?.user);
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  return (
    <header className="w-full fixed border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto  flex flex-end justify-between px-4 py-1">
        {/* Left: Logo or site name */}
        <Link href="/" className="flex items-center gap-2">
          <FillinLogo />
        </Link>

        {/* Right: Nav actions */}
        <div className="flex backdrop-blur rounded-md items-center gap-3">
          <Button
            variant="ghost"
            className="text-neutral-500 hidden font-semibold"
          >
            <Search width={20} height={20} className="mr-2" />
            Search
          </Button>

          <Button variant="ghost" className="text-neutral-500">
            <Settings width={20} height={20} />
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 rounded-full overflow-hidden border cursor-pointer">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm">
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
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOutIcon size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
};
