import { LogicCondition } from "./types";
import { Form } from "./types";

export function matchesCondition(answer: unknown, condition: LogicCondition) {
  switch (condition.operator) {
    case "equals":
      return answer === condition.value;
    case "not_equals":
      return answer !== condition.value;
    case "contains":
      return (
        typeof answer === "string" && answer.includes(String(condition.value))
      );
    case "greater_than":
      return typeof answer === "number" && answer > Number(condition.value);

    case "less_than":
      return typeof answer === "number" && answer < Number(condition.value);

    default:
      return false;
  }
}

export function getNextBlockId(
  currentBlockId: string,
  answers: Record<string, unknown>,
  form: Form
) {
  const jumps = form.logicJumps
    .filter((j) => j.fromBlockId === currentBlockId)
    .sort((a, b) => a.order - b.order);

  for (const jump of jumps) {
    const answer = answers[jump.condition.blockId];
    if (answer === undefined) continue;

    if (matchesCondition(answer, jump.condition)) {
      return jump.toBlockId;
    }
  }

  const index = form.blocks.findIndex((b) => b.id === currentBlockId);
  if (index === -1) return null;

  return form.blocks[index + 1]?.id ?? null;
}
