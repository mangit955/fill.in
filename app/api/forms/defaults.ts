import {
  Form,
  LongTextBlock,
  LongTextConfig,
  MultipleChoiceBlock,
  MultipleChoiceConfig,
  ShortTextBlock,
  ShortTextConfig,
} from "./types";

//Id generator (centralized)
function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

//default configs

function createShortTextConfig(): ShortTextConfig {
  return {
    label: "short Answer",
    placeholder: "Type your answer here",
    maxLength: 100,
  };
}

function createLongTextConfig(): LongTextConfig {
  return {
    label: "Long Answer",
    placeholder: "Type your answer",
    rows: 4,
  };
}

function createMultipleChoiceConfig(): MultipleChoiceConfig {
  return {
    label: "Choose an option",
    options: ["Option 1", "Option 2"],
    allowMultiple: false,
  };
}

//factory functions

export function createShortTextBlock(): ShortTextBlock {
  return {
    id: generateId("short_text"),
    type: "short_text",
    required: false,
    config: createShortTextConfig(),
  };
}

export function createLongTextBlock(): LongTextBlock {
  return {
    id: generateId("long_text"),
    type: "long_text",
    required: false,
    config: createLongTextConfig(),
  };
}

export function createMultipleChoiceBlock(): MultipleChoiceBlock {
  return {
    id: generateId("multiple_choice"),
    type: "multiple_choice",
    required: false,
    config: createMultipleChoiceConfig(),
  };
}

export function createEmptyForm(): Form {
  return {
    id: "draft",
    title: "Untitled Form",
    description: "",
    blocks: [],
  };
}
