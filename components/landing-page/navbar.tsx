"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming you already have your button component
import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="w-full  border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex flex-end justify-between px-4 py-1 ">
        {/* Left: Logo or site name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg" // or /logo.png — put your file inside the public/ folder
            alt="Fill.in logo"
            width={150} // adjust as needed
            height={150}
            className="rounded-sm" // optional: or remove
          />
        </Link>

        {/* Right: Nav actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-gray-500 hidden md:inline-flex cursor-pointer"
          >
            Pricing
          </Button>
          <Button variant="ghost" className="text-gray-500 cursor-pointer">
            Log in
          </Button>
          <Button variant="ghost" className="text-gray-500 cursor-pointer">
            Sign up
          </Button>
          <Link href="/builder">
            <Button
              variant="default"
              className="hidden md:inline-flex cursor-pointer"
            >
              Create form
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};
