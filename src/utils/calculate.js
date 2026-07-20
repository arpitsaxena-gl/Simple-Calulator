/** Operator tokens as stored in the expression (trailing space after op). */
export const OPERATOR_TOKENS = ["+ ", "- ", "* ", "/ "];

const NUMBER_RE = /^-?\d+(\.\d+)?$/;
const OPS = new Set(["+", "-", "*", "/"]);

/**
 * @param {string} expression
 * @returns {boolean}
 */
export function endsWithOperator(expression) {
  if (!expression) return false;
  return OPERATOR_TOKENS.some((op) => expression.endsWith(op));
}

/**
 * @param {string} token
 * @returns {number | null}
 */
function parseOperand(token) {
  if (!NUMBER_RE.test(token)) return null;
  const n = Number(token);
  return Number.isFinite(n) ? n : null;
}

/**
 * Left-to-right evaluation (no operator precedence).
 * @param {string} expression
 * @returns {{ ok: true, value: number } | { ok: false, error: string }}
 */
export function calculate(expression) {
  const source = String(expression ?? "");
  if (!source.trim()) {
    return { ok: false, error: "Error" };
  }
  if (endsWithOperator(source)) {
    return { ok: false, error: "Error" };
  }

  const tokens = source.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0 || tokens.length % 2 === 0) {
    return { ok: false, error: "Error" };
  }

  let acc = parseOperand(tokens[0]);
  if (acc === null) {
    return { ok: false, error: "Error" };
  }

  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const rhsToken = tokens[i + 1];
    if (!OPS.has(op) || rhsToken === undefined) {
      return { ok: false, error: "Error" };
    }
    const rhs = parseOperand(rhsToken);
    if (rhs === null) {
      return { ok: false, error: "Error" };
    }
    if (op === "/" && rhs === 0) {
      return { ok: false, error: "Error" };
    }
    switch (op) {
      case "+":
        acc += rhs;
        break;
      case "-":
        acc -= rhs;
        break;
      case "*":
        acc *= rhs;
        break;
      case "/":
        acc /= rhs;
        break;
      default:
        return { ok: false, error: "Error" };
    }
    if (!Number.isFinite(acc)) {
      return { ok: false, error: "Error" };
    }
  }

  return { ok: true, value: acc };
}

/**
 * Current number token (after last operator), or full string if no operator.
 * @param {string} expression
 */
function currentNumberSegment(expression) {
  let lastIdx = -1;
  let lastLen = 0;
  for (const op of OPERATOR_TOKENS) {
    const idx = expression.lastIndexOf(op);
    if (idx > lastIdx) {
      lastIdx = idx;
      lastLen = op.length;
    }
  }
  if (lastIdx === -1) return expression;
  return expression.slice(lastIdx + lastLen);
}

/**
 * @param {string} expression
 * @param {string} digit
 * @returns {string}
 */
export function appendDigit(expression, digit) {
  const prev = expression ?? "";
  const ch = String(digit);

  if (ch === ".") {
    if (prev === "" || endsWithOperator(prev)) {
      return `${prev}0.`;
    }
    const segment = currentNumberSegment(prev);
    if (segment.includes(".")) {
      return prev;
    }
    return `${prev}.`;
  }

  return prev + ch;
}

/**
 * @param {string} expression
 * @param {string} operator
 * @returns {string}
 */
export function appendOperator(expression, operator) {
  const prev = expression ?? "";
  if (prev === "" || endsWithOperator(prev)) {
    return prev;
  }
  return `${prev} ${operator} `;
}

/**
 * Remove last operator token (" X ") or last char of current number.
 * @param {string} expression
 * @returns {string}
 */
export function tokenAwareBackspace(expression) {
  const prev = expression ?? "";
  if (!prev) return "";
  if (endsWithOperator(prev)) {
    return prev.slice(0, -3);
  }
  return prev.slice(0, -1);
}

/**
 * @param {number} value
 * @returns {string}
 */
export function formatResult(value) {
  if (!Number.isFinite(value)) return "Error";
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 1e12) / 1e12;
  return String(rounded);
}
