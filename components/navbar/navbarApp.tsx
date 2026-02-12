"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming you already have your button component
import { Spinner } from "@/components/ui/spinner";
import { FillinLogo } from "../ui/svg/logo";

type Props = {
  onPublish?: () => void;
  isPublishing?: boolean;
  onPreview?: () => void;
};

export const NavbarApp = ({ onPublish, isPublishing, onPreview }: Props) => {
  return (
    <header className="w-full fixed border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto  flex flex-end justify-between px-4 py-1 ">
        {/* Left: Logo or site name */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <FillinLogo />
        </Link>

        {/* Right: Nav actions */}
        <div className="flex backdrop-blur rounded-md items-center gap-3">
          <Button asChild variant="ghost" className="text-neutral-500 hidden">
            <Link href="/dashboard">Home</Link>
          </Button>
          <Button variant="ghost" className="text-neutral-500">
            Sign up
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (onPreview) onPreview();
            }}
            className="text-neutral-500  "
          >
            Preview
          </Button>
          <Button
            variant="default"
            className="hidden  md:inline-flex  min-w-[100px] justify-center"
            onClick={() => {
              if (onPublish) onPublish();
            }}
          >
            <span className="flex items-center justify-center w-full">
              {isPublishing ? (
                <Spinner height={20} width={20} strokeWidth={3} />
              ) : (
                "Publish"
              )}
            </span>
          </Button>
        </div>
      </nav>
    </header>
  );
};
