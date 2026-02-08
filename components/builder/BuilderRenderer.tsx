import {
  FormBlock,
  LongTextBlock as LongTextBlockType,
  MultipleChoiceBlock as MultipleChoiceBlockType,
  ShortTextBlock as ShortTextBlockType,
  EmailBlock as EmailBlockType,
  PhoneBlock as PhoneBlockType,
  DateBlock as DateBlockType,
  LinkBlock as LinkBlockType,
  NumberBlock as NumberBlockType,
  RatingBlock as RatingBlockType,
  FileUploadBlock as FileUploadBlockType,
} from "../../lib/forms/types";
import DateBlock from "./Blocks/DateBlock";
import EmailBlock from "./Blocks/EmailBlock";
import FileUploadBlock from "./Blocks/FileUploadBlock";
import LinkBlock from "./Blocks/LinkBlock";
import LongTextBlock from "./Blocks/LongTextBlock";
import MultipleChoiceBlock from "./Blocks/MultipleChoiceBlock";
import NumberBlock from "./Blocks/NumberBlock";
import PhoneBlock from "./Blocks/PhoneBlock";
import RatingBlock from "./Blocks/RatingBlock";
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

    case "date":
      return (
        <DateBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<DateBlockType>(id, updater)
          }
        />
      );

    case "link":
      return (
        <LinkBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<LinkBlockType>(id, updater)
          }
        />
      );

    case "number":
      return (
        <NumberBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<NumberBlockType>(id, updater)
          }
        />
      );

    case "rating":
      return (
        <RatingBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<RatingBlockType>(id, updater)
          }
        />
      );

    case "fileUpload":
      return (
        <FileUploadBlock
          block={block}
          autoFocus={autoFocus}
          onUpdateMeta={onUpdateMeta}
          onUpdateConfig={(id, updater) =>
            onUpdateConfig<FileUploadBlockType>(id, updater)
          }
        />
      );

    default:
      return null;
  }
}
