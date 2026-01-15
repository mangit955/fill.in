import { Button } from "./button";
import { motion } from "framer-motion";

export function BlockButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
    >
      <Button
        variant="ghost"
        onClick={onClick}
        className="flex gap-2 w-full border justify-start text-sm text-neutral-500 cursor-pointer"
      >
        {children}
      </Button>
    </motion.div>
  );
}
