import { Button } from "./button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BlockButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?:string;
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
        className={cn("flex items-center border gap-2 w-full justify-start text-left",
  "text-sm text-neutral-500 cursor-pointer", className)}
      >
        {children}
      </Button>
    </motion.div>
  );
}
