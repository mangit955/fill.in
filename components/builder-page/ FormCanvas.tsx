"use client";

import { useState } from "react";
import SortableField from "./SortableField";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function FormCanvas() {
  const [form, setForm] = useState<{ title: string; fields: Field[] }>({
    title: "Untitled Form",
    fields: [],
  });
  const [input, setInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  type DragEndEvent = {
    active: { id: string };
    over: { id: string } | null;
  };

  type Field = {
    id: string;
    type: "text" | "email" | string;
    placeholder?: string;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setForm((prevForm) => {
      const oldIndex = prevForm.fields.findIndex((i) => i.id === active.id);
      const newIndex = prevForm.fields.findIndex((i) => i.id === over.id);
      const newFields = arrayMove(prevForm.fields, oldIndex, newIndex);
      return { ...prevForm, fields: newFields };
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.startsWith("/")) {
        const command = input.slice(1);
        const id = Date.now().toString();
        let newField = null;

        if (command === "text") {
          newField = { id, type: "text", label: "Untitled text field" };
        } else if (command === "email") {
          newField = { id, type: "email", label: "Email" };
        }

        if (newField) {
          setForm((prevForm) => ({
            ...prevForm,
            fields: [...prevForm.fields, newField],
          }));
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
        <SortableContext
          items={form.fields}
          strategy={verticalListSortingStrategy}
        >
          {form.fields.map((field) => (
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
