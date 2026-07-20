const OPERATORS = ["+", "-", "*", "/"];

export const MAX_EXPRESSION_LENGTH = 64;

export function endsWithOperator(expression) {
  const trimmed = String(expression || "").trimEnd();
  return OPERATORS.some(
    (op) => trimmed.endsWith(` ${op}`) || trimmed.endsWith(op)
  );
}

export function lastNumberSegment(expression) {
  const parts = String(expression || "")
    .trim()
    .split(" ");
  return parts[parts.length - 1] || "";
}

/**
 * Left-to-right evaluator (no operator precedence).
 * @param {string} expression
 * @returns {number|""|"Error"}
 */
export function calculate(expression) {
  const tokens = String(expression || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return "";

  let resultValue = parseFloat(tokens[0]);
  if (!Number.isFinite(resultValue)) {
    return "Error";
  }

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const nextNumber = parseFloat(tokens[i + 1]);

    if (!Number.isFinite(nextNumber)) {
      return "Error";
    }

    switch (operator) {
      case "+":
        resultValue += nextNumber;
        break;
      case "-":
        resultValue -= nextNumber;
        break;
      case "*":
        resultValue *= nextNumber;
        break;
      case "/":
        if (nextNumber === 0) {
          return "Error";
        }
        resultValue /= nextNumber;
        break;
      default:
        return "Error";
    }
  }

  if (!Number.isFinite(resultValue)) {
    return "Error";
  }

  return Number(Number(resultValue.toPrecision(12)).toString());
}

export { OPERATORS };
