"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function FormCanvas() {
  const [fields, setFields] = useState([
    { id: "1", type: "text", label: "Your Name" },
    { id: "2", type: "email", label: "Email Address" },
  ]);
  const [input, setInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  type DragEndEvent = {
    active: { id: string };
    over: { id: string } | null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.startsWith("/")) {
        const command = input.slice(1);
        const id = Date.now().toString();
        if (command === "text") {
          setFields([
            ...fields,
            { id, type: "text", label: "Untitled Text Field" },
          ]);
        } else if (command === "email") {
          setFields([...fields, { id, type: "email", label: "Email" }]);
        }
      }
      setInput("");
    }
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) =>
          handleDragEnd({
            active: { id: String(event.active.id) },
            over: event.over ? { id: String(event.over.id) } : null,
          })
        }
      >
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <SortableField key={field.id} id={field.id} field={field} />
          ))}
        </SortableContext>
      </DndContext>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Type "/" for commands...'
        className="border px-3 py-2 w-full rounded mt-4"
      />
    </div>
  );
}

type Field = {
  id: string;
  type: string;
  label: string;
};

function SortableField({ id, field }: { id: string; field: Field }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-md p-4 bg-white dark:bg-neutral-900 shadow-sm flex items-center gap-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-500 hover:text-gray-800"
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
    </div>
  );
}
