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
      {/* Toggle & rotation animation*/}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-lg text-gray-300 cursor-pointer font-medium  flex items-center gap-2"
      >
        <motion.span
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
          className="inline-block text-3xl font-semibold text-pink-500"
        >
          +
        </motion.span>
        <span>Add a block/</span>
      </motion.button>

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
