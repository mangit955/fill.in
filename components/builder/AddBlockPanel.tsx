"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlockButton } from "../ui/blockButton";

type Props = {
  onAddShortText: () => void;
  onAddLongText: () => void;
  onAddMultipleChoice: () => void;
};

export default function AddBlockPanel({
  onAddLongText,
  onAddShortText,
  onAddMultipleChoice,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-md p-6 space-y-2">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-sm cursor-pointer font-medium text-pink-500"
      >
        + Add a block
      </button>

      {/* Animated list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden w-fit"
          >
            <div className=" rounded-md">
              <BlockButton onClick={onAddShortText}>Short text</BlockButton>
              <BlockButton onClick={onAddLongText}>Long text</BlockButton>
              <BlockButton onClick={onAddMultipleChoice}>
                Multiple choice
              </BlockButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
