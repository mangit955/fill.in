import { FormBlock } from "../../lib/forms/types";
import LongTextBlock from "./LongTextBlock";
import MultipleChoiceBlock from "./MultipleChoiceBlock";
import ShortTextBlock from "./ShortTextBlock";

type BlockRendererProps = {
  block: FormBlock;
};

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "short_text":
      return <ShortTextBlock block={block} />;

    case "long_text":
      return <LongTextBlock block={block} />;

    case "multiple_choice":
      return <MultipleChoiceBlock block={block} />;

    default:
      return null;
  }
}
