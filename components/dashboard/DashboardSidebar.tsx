"use client";

import Link from "next/link";
import { Home, FileText, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { LogOutIcon, LayoutDashboardIcon, FileTextIcon } from "lucide-react";

export default function DashboardSidebar() {
  const [user, setUser] = useState<any>(null);

  // debug
  useEffect(() => {
    if (user) {
      console.log("SIDEBAR USER:", user);
      console.log("AVATAR URL:", user?.user_metadata?.avatar_url);
    }
  }, [user]);

  useEffect(() => {
    // get current session (better than getUser for metadata)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  return (
    <aside className="w-64 h-screen border-r bg-white p-4 hidden md:block">
      <div>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-full overflow-hidden border cursor-pointer">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    referrerPolicy="no-referrer"
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

      <nav className="flex flex-col gap-2 text-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <Home size={16} />
          Home
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <FileText size={16} />
          My forms
        </Link>

        <Link
          href="/create"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <Plus size={16} />
          New form
        </Link>
      </nav>
    </aside>
  );
}
