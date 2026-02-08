import { RatingBlock as RatingBlockType } from "@/lib/forms/types";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

type Props = {
  block: RatingBlockType;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: (
    blockId: string,
    updater: (config: RatingBlockType["config"]) => RatingBlockType["config"]
  ) => void;
};

export default function RatingBlock({
  block,
  autoFocus,
  onUpdateMeta,
  onUpdateConfig,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(block.config.label);
  const [hover, setHover] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function save() {
    if (value === block.config.label) {
      setIsEditing(false);
      return;
    }

    onUpdateConfig(block.id, (config) => ({
      ...config,
      label: value,
    }));

    setIsEditing(false);
  }

  useEffect(() => {
    if (autoFocus && isEditing) inputRef.current?.focus();
  }, [autoFocus, isEditing]);

  useEffect(() => {
    if (autoFocus) setIsEditing(true);
  }, [autoFocus]);

  return (
    <div className="p-4">
      {isEditing ? (
        <input
          ref={inputRef}
          placeholder="Type a question"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          className="w-full text-xl font-medium bg-transparent outline-none"
        />
      ) : (
        <p
          className="text-xl font-medium cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {block.config.label}
          <span
            onClick={(e) => {
              e.stopPropagation();
              onUpdateMeta(block.id, { required: !block.required });
            }}
            className={`ml-1 ${
              block.required
                ? "text-red-500"
                : "text-neutral-300 hover:text-neutral-500"
            }`}
          >
            *
          </span>
        </p>
      )}

      {/* preview stars */}
      <div className="flex  mt-2" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: block.config.max ?? 5 }).map((_, i) => {
          const starValue = i + 1;
          const active = hover !== null && starValue <= hover;

          return (
            <Star
              key={i}
              size={38}
              onMouseEnter={() => setHover(starValue)}
              className={
                active
                  ? "text-yellow-400 fill-yellow-400 cursor-pointer"
                  : "text-neutral-300 hover:text-yellow-400 cursor-pointer"
              }
            />
          );
        })}
      </div>
    </div>
  );
}
