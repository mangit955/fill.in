export type BlockType = "short_text" | "long_text" | "multiple_choice";

// config types

export type ShortTextConfig = {
  label: string;
  placeholder: string;
  maxLength: number;
};

export type LongTextConfig = {
  label: string;
  placeholder: string;
  rows: number;
};

export type MultipleChoiceConfig = {
  label: string;
  options: string[];
  allowMultiple: boolean;
};

//block types

export type BaseBlock = {
  id: string;
  required: boolean;
};

export type ShortTextBlock = BaseBlock & {
  type: "short_text";
  config: ShortTextConfig;
};

export type LongTextBlock = BaseBlock & {
  type: "long_text";
  config: LongTextConfig;
};
export type MultipleChoiceBlock = BaseBlock & {
  type: "multiple_choice";
  config: MultipleChoiceConfig;
};

export type FormBlock = ShortTextBlock | LongTextBlock | MultipleChoiceBlock;

//Form

export type Form = {
  id: string;
  title: string;
  description: string;
  blocks: FormBlock[];
};
