import { LongTextBlock as LongTextBlockType } from "@/lib/forms/types";

type Props = {
  block: LongTextBlockType;
};

export default function LongTextBlock({ block }: Props) {
  return (
    <div className="border rounded-md p-4">
      <label className="block text-sm font-medium mb-1">
        {block.config.label}
      </label>
      <textarea
        disabled
        rows={block.config.rows}
        placeholder={block.config.placeholder}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
}
