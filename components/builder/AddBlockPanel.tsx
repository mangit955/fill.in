"use client";
import * as React from "react";
import { motion } from "framer-motion";

import {
  AtSign,
  Calendar,
  CircleCheckBig,
  Clock,
  Ellipsis,
  Hash,
  Link,
  Phone,
  Rows2,
  Rows3,
  Star,
  Upload,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";
import { Kbd, KbdGroup } from "../ui/kbd";

type Props = {
  onAddShortText: () => void;
  onAddLongText: () => void;
  onAddMultipleChoice: () => void;
  onAddEmail: () => void;
  onAddPhone: () => void;
  onAddDate: () => void;
  onAddLink: () => void;
  onAddNumber: () => void;
  onAddRating: () => void;
  onAddFileUpload: () => void;
  onAddTime: () => void;
  onAddLinearScale: () => void;
};

export default function AddBlockPanel({
  onAddLongText,
  onAddShortText,
  onAddMultipleChoice,
  onAddEmail,
  onAddPhone,
  onAddDate,
  onAddLink,
  onAddNumber,
  onAddRating,
  onAddFileUpload,
  onAddTime,
  onAddLinearScale,
}: Props) {
  const [open, setOpen] = React.useState(false);

  function flash() {
    document.body.animate([{ opacity: 1 }, { opacity: 0.97 }, { opacity: 1 }], {
      duration: 120,
    });
  }

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;

      // ignore when typing inside inputs
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // ---------- SLASH COMMAND ----------
      if (e.key === "/") {
        if (open) return;
        e.preventDefault();
        e.stopPropagation();
        // extra safety: stop other listeners + avoid slash being typed
        if ("stopImmediatePropagation" in e) {
          (e as any).stopImmediatePropagation();
        }
        setOpen(true);
        return;
      }

      // ---------- SHORTCUTS ----------
      if (!(e.metaKey || e.ctrlKey)) return;
      if (open) return;

      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault();
          onAddShortText();
          flash();
          break;

        case "l":
          if (e.shiftKey) {
            e.preventDefault();
            onAddLinearScale();
          } else {
            e.preventDefault();
            onAddLongText();
            flash();
          }
          break;

        case "m":
          e.preventDefault();
          onAddMultipleChoice();
          flash();
          break;

        case "e":
          e.preventDefault();
          onAddEmail();
          flash();
          break;

        case "p":
          e.preventDefault();
          onAddPhone();
          flash();
          break;

        case "d":
          e.preventDefault();
          onAddDate();
          flash();
          break;

        case "t":
          e.preventDefault();
          onAddTime();
          flash();
          break;

        case "n":
          e.preventDefault();
          onAddNumber();
          flash();
          break;

        case "k":
          if (e.shiftKey) {
            e.preventDefault();
            onAddLink();
            flash();
          }
          break;

        case "r":
          e.preventDefault();
          onAddRating();
          flash();
          break;

        case "u":
          e.preventDefault();
          onAddFileUpload();
          flash();
          break;
      }
    }

    window.addEventListener("keydown", handleKey, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKey, { capture: true });
  }, [
    onAddShortText,
    onAddLongText,
    onAddMultipleChoice,
    onAddEmail,
    onAddPhone,
    onAddDate,
    onAddTime,
    onAddNumber,
    onAddLink,
    onAddRating,
    onAddFileUpload,
    onAddLinearScale,
    open,
  ]);

  return (
    <div className="rounded-md p-6 space-y-2">
      {/* Trigger button */}
      <motion.div
        whileHover="hover"
        whileFocus="hover"
        className="inline-block"
      >
        <motion.button
          onClick={() => setOpen(true)}
          className="text-lg text-gray-400 hover:text-gray-600 font-medium flex items-center gap-2 hover:bg-neutral-100 rounded-md px-1 cursor-pointer"
        >
          <motion.span
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="inline-block text-3xl text-pink-400 hover:text-pink-500"
          >
            +
          </motion.span>
          <span>Press to start from scratch</span>
        </motion.button>
      </motion.div>

      {/* Command dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search question type..." />
          <CommandList>
            <CommandEmpty>No block found.</CommandEmpty>

            <CommandGroup heading="Basic">
              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddShortText();
                  setOpen(false);
                }}
              >
                <Rows2 className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Short text</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">S</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddLongText();
                  setOpen(false);
                }}
              >
                <Rows3 className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Long text</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">L</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddMultipleChoice();
                  setOpen(false);
                }}
              >
                <CircleCheckBig className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Multiple choice</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">M</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Contact">
              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddEmail();
                  setOpen(false);
                }}
              >
                <AtSign className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Email</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">E</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddPhone();
                  setOpen(false);
                }}
              >
                <Phone className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Phone</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">P</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Other">
              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddDate();
                  setOpen(false);
                }}
              >
                <Calendar className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Date</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">D</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddTime();
                  setOpen(false);
                }}
              >
                <Clock className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Time</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">T</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddNumber();
                  setOpen(false);
                }}
              >
                <Hash className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Number</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">N</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddLink();
                  setOpen(false);
                }}
              >
                <Link className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Link</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">⇧</Kbd>
                    <Kbd className="transition group-hover:bg-white">K</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddRating();
                  setOpen(false);
                }}
              >
                <Star className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Rating</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">R</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddFileUpload();
                  setOpen(false);
                }}
              >
                <Upload className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">File upload</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">U</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>

              <CommandItem
                className="cursor-pointer group"
                onSelect={() => {
                  onAddLinearScale();
                  setOpen(false);
                }}
              >
                <Ellipsis className="text-neutral-400 group-hover:text-neutral-700" />
                <span className="flex-1">Linear scale</span>
                <CommandShortcut>
                  <KbdGroup>
                    <Kbd className="transition group-hover:bg-white">⌘</Kbd>
                    <Kbd className="transition group-hover:bg-white">⇧</Kbd>
                    <Kbd className="transition group-hover:bg-white">L</Kbd>
                  </KbdGroup>
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
