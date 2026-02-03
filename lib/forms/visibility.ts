import { matchesCondition } from "./evaluate";
import { Form } from "./types";

export function isBlockVisible(
  blockId: string,
  answers: Record<string, unknown>,
  form: Form
): boolean {
  const rule = form.visibilityRules.find((r) => r.targetBlockId === blockId);

  if (!rule) return true;

  if (!(rule.condition.blockId in answers)) {
    return false;
  }

  const answer = answers[rule.condition.blockId];

  return matchesCondition(answer, rule.condition);
}
