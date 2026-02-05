// “These are the only valid shapes that form data can ever have in my app.”
// UI changes.
// Backend changes.
// Database changes.
// But this stays stable.
// That’s why this file is so important.

// BlockType — why not just use strings?
// What this does
// This creates a closed set of allowed values.
// TypeScript now knows:
// "short_text" ✅
// "email" ❌
// "ShortText" ❌
// This means:
// “There are exactly 3 block types. No more. No less.”

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

export type MCQOption = {
  id: string;
  label: string;
};

export type MultipleChoiceConfig = {
  label: string;

  options: MCQOption[];
  allowMultiple: boolean;
};

//block types

export type BaseBlock = {
  id: string;
  required: boolean;
};

// What & means
// It means intersection.
// So ShortTextBlock become
// {
//   id: string;
//   required: boolean;
//   type: "short_text";
//   config: ShortTextConfig;
// }

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

export type LogicOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than";

export type LogicCondition = {
  blockId: string;
  operator: LogicOperator;
  value: unknown;
};

export type LogicJump = {
  id: string;
  fromBlockId: string;
  order: number;
  condition: LogicCondition;
  toBlockId: string;
};

export type VisibilityRule = {
  id: string;
  targetBlockId: string;
  condition: LogicCondition;
};

export type Form = {
  id: string;
  slug: string;
  title: string;
  description: string;
  blocks: FormBlock[];
  logicJumps: LogicJump[];
  visibilityRules: VisibilityRule[];
};

// What TypeScript learns from this

// It learns that:
// If type === "short_text"
// → config is ShortTextConfig
// If type === "long_text"
// → config is LongTextConfig
// So this works:
// function renderBlock(block: FormBlock) {
//   if (block.type === "short_text") {
//     block.config.maxLength; // ✅ allowed
//     block.config.rows;      // ❌ error (correctly)
//   }
// }
