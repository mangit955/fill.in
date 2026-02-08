import {
  EmailBlock,
  Form,
  LongTextBlock,
  LongTextConfig,
  MultipleChoiceBlock,
  MultipleChoiceConfig,
  PhoneBlock,
  ShortTextBlock,
  ShortTextConfig,
} from "./types";

//Id generator (centralized): did this to maintain consistency(not repeating the same logic again)

//By centralizing:
//All blocks follow same ID pattern
//Easy to change later (e.g. nanoid)

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

//default configs

// WHY functions, not objects?
// Because functions return a NEW object each time.

// That means:
// No shared references
// Editing one block doesn’t mutate others

function createShortTextConfig(): ShortTextConfig {
  return {
    label: "",
    placeholder: "Type your answer",
    maxLength: 100,
  };
}

function createLongTextConfig(): LongTextConfig {
  return {
    label: "",
    placeholder: "Type your answer",
    rows: 4,
  };
}

function createMultipleChoiceConfig(): MultipleChoiceConfig {
  return {
    label: "",
    options: [{ id: crypto.randomUUID(), label: "Option 1" }],
    allowMultiple: false,
  };
}

//factory functions

// What this guarantees
// Every Short Text block:
// Has an ID
// Has correct type
// Has required flag
// Has a valid config

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
    required: true,
    config: createMultipleChoiceConfig(),
  };
}

export function createEmailBlock(): EmailBlock {
  return {
    id: crypto.randomUUID(),
    type: "email",
    required: true,
    config: {
      label: "Email",
      placeholder: "Enter your email",
    },
  };
}

export function createPhoneBlock(): PhoneBlock {
  return {
    id: crypto.randomUUID(),
    type: "phone",
    required: true,
    config: {
      label: "",
      placeholder: "Enter your phone number",
    },
  };
}

export function createEmptyForm(): Form {
  return {
    id: crypto.randomUUID(),
    slug: crypto.randomUUID(),
    title: "",
    description: "",
    blocks: [],
    visibilityRules: [],
    logicJumps: [],
  };
}
