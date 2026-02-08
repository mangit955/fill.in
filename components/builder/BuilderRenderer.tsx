import {
  FormBlock,
  LongTextBlock as LongTextBlockType,
  MultipleChoiceBlock as MultipleChoiceBlockType,
  ShortTextBlock as ShortTextBlockType,
  EmailBlock as EmailBlockType,
  PhoneBlock as PhoneBlockType,
} from "../../lib/forms/types";
import EmailBlock from "./Blocks/EmailBlock";
import LongTextBlock from "./Blocks/LongTextBlock";
import MultipleChoiceBlock from "./Blocks/MultipleChoiceBlock";
import PhoneBlock from "./Blocks/PhoneBlock";
import ShortTextBlock from "./Blocks/ShortTextBlock";

type BlockRendererProps = {
  block: FormBlock;
  autoFocus?: boolean;
  onUpdateMeta: (blockId: string, updates: { required?: boolean }) => void;
  onUpdateConfig: <T extends FormBlock>(
    blockId: string,
    updater: (config: T["config"]) => T["config"]
  ) => void;
};

export default function BlockRenderer({
  block,
  autoFocus,
  onUpdateMeta,
  onUpdateConfig,
}: BlockRendererProps) {
  switch (block.type) {
    case "short_text":
      return (
        <ShortTextBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<ShortTextBlockType>(id, updater)
          }
        />
      );

    case "long_text":
      return (
        <LongTextBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<LongTextBlockType>(id, updater)
          }
        />
      );

    case "multiple_choice":
      return (
        <MultipleChoiceBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<MultipleChoiceBlockType>(id, updater)
          }
        />
      );

    case "email":
      return (
        <EmailBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<EmailBlockType>(id, updater)
          }
        />
      );

    case "phone":
      return (
        <PhoneBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<PhoneBlockType>(id, updater)
          }
        />
      );

    default:
      return null;
  }
}
