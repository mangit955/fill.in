"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming you already have your button component
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  onPublish?: () => void;
  isPublishing?: boolean;
};

export const NavbarApp = ({ onPublish, isPublishing }: Props) => {
  return (
    <header className="w-full  border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex flex-end justify-between px-4 py-1 ">
        {/* Left: Logo or site name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/favicon.ico" // or /logo.png — put your file inside the public/ folder
            alt="Fill.in logo"
            width={30} // adjust as needed
            height={30}
            className="rounded-sm" // optional: or remove
          />
        </Link>

        {/* Right: Nav actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-gray-500 hidden md:inline-flex cursor-pointer"
          >
            Customize
          </Button>
          <Button variant="ghost" className="text-gray-500 cursor-pointer">
            Sign up
          </Button>
          <Button variant="ghost" className="text-gray-500 cursor-pointer">
            Preview
          </Button>
          <Button
            variant="default"
            className="hidden md:inline-flex cursor-pointer"
            onClick={() => {
              if (onPublish) onPublish();
            }}
            disabled={isPublishing}
          >
            {isPublishing ? <Spinner /> : "Publish"}
          </Button>
        </div>
      </nav>
    </header>
  );
};
