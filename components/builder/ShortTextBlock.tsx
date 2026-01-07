import { ShortTextBlock as ShortTextBlockType } from "@/lib/forms/types";

type Props = {
  block: ShortTextBlockType;
};

export default function ShortTextBlock({ block }: Props) {
  return (
    <div className="border rounded-md p-4">
      <label className="block text-sm font-medium mb-1">
        {block.config.label}
      </label>
      <input
        disabled
        placeholder={block.config.placeholder}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
}
