"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming you already have your button component
import { FillinLogo } from "../ui/svg/logo";
import { Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { NavbarAvatar } from "@/components/navbar/avatar";
import type { User } from "@supabase/supabase-js";

export const NavbarHome = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Removed const avatarUrl = user?.user_metadata?.avatar_url?.split("=")[0] || null;

  return (
    <header className="w-full fixed border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto  flex flex-end justify-between px-4 py-1">
        {/* Left: Logo or site name */}
        <Link
          href="/dashboard"
          className="flex items-center hover:bg-gray-100 rounded-md p-1 focus:ring-3 focus:ring-blue-200 gap-2"
        >
          <FillinLogo className="text-neutral-500 hover:text-neutral-600" />
        </Link>

        {/* Right: Nav actions */}
        <div className="flex backdrop-blur rounded-md items-center gap-3">
          <Button
            variant="ghost"
            className="text-neutral-500 cursor-not-allowed! hidden font-semibold"
          >
            <Search width={20} height={20} className="mr-2" />
            Search
          </Button>

          <Button
            variant="ghost"
            className="text-neutral-500 cursor-not-allowed!"
          >
            <Settings width={20} height={20} />
          </Button>

          {user && <NavbarAvatar user={user} />}
        </div>
      </nav>
    </header>
  );
};
