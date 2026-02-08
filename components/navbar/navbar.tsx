"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming you already have your button component
import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-50 border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex justify-between px-4 py-2 items-center">
        {/* Left: Logo or site name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/vilvaLogo.png" // or /logo.png — put your file inside the public/ folder
            alt="Fill.in logo"
            width={150} // adjust as needed
            height={150}
            className="  rounded-md" // optional: or remove
          />
        </Link>

        {/* Right: Nav actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-neutral-500 focus:ring-4 ring-blue-300 dark:text-gray-300 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md  dark:hover:bg-zinc-900/80 hover:text-black dark:hover:text-white transition-colors duration-200 border border-white/30 dark:border-white/10 rounded-full px-3 py-1.5 cursor-pointer hidden md:inline-flex"
          >
            Priceing
          </Button>
          <Button
            variant="ghost"
            className="text-neutral-500 focus:ring-4 ring-blue-300 dark:text-gray-300 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md  dark:hover:bg-zinc-900/80 hover:text-black dark:hover:text-white transition-colors duration-200 border border-white/30 dark:border-white/10 rounded-full px-3 py-1.5 cursor-pointer"
          >
            Log in
          </Button>
          <Button
            variant="ghost"
            className="text-neutral-500 focus:ring-4 ring-blue-300 dark:text-gray-300 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md  dark:hover:bg-zinc-900/80 hover:text-black dark:hover:text-white transition-colors duration-200 border border-white/30 dark:border-white/10 rounded-full px-3 py-1.5 cursor-pointer"
          >
            Sign up
          </Button>
          <Link href="/create">
            <Button
              variant="default"
              className="hidden md:inline-flex focus:ring-4 ring-blue-300 bg-blue-600 text-white hover:bg-blue-500 rounded-full px-4 py-1.5 shadow-sm cursor-pointer"
            >
              Create form
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};
