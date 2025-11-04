"use client";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableField({
  id,
  field,
}: {
  id: string;
  field: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 1.02 }}
      className={`border rounded-md p-4 bg-white dark:bg-neutral-900 shadow-sm flex items-center gap-3 cursor-default ${
        isDragging ? "opacity-70 scale-[1.02]" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-500 hover:text-gray-800 active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">{field.label}</label>
        <input
          type={field.type}
          className="border px-2 py-1 rounded w-full text-sm"
          placeholder={field.label}
        />
      </div>
    </motion.div>
  );
}
