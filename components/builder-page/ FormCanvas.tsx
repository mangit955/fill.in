"use client";
import { useState } from "react";

type Field = {
  type: string;
  label: string;
};

export default function FormCanvas() {
  const [fields, setFields] = useState<Field[]>([]);
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.startsWith("/")) {
        const commond = input.slice(1);
        if (commond === "text") {
          setFields([
            ...fields,
            { type: "text", label: "Untitled Text Field" },
          ]);
        } else if (commond === "email") {
          setFields([...fields, { type: "email", label: "Email" }]);
        }
      }
      setInput("");
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={i} className="border p-4 rounded-md">
          <label className="block text-sm mb-1">{field.label}</label>
          <input
            type={field.type}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      ))}
    </div>
  );
}
