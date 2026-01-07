import { MultipleChoiceBlock as MultipleChoiceBlockType } from "@/lib/forms/types";

type Props = {
  block: MultipleChoiceBlockType;
};

export default function MultipleChoiceBlock({ block }: Props) {
  return (
    <div className="border rounded-md p-4">
      <p className="text-sm font-medium mb-2">{block.config.label}</p>

      {block.config.options.map((option, index) => (
        <label key={index} className="flex items-center gap-2 text-sm">
          <input type="checkbox" disabled />
          {option}
        </label>
      ))}
    </div>
  );
}
