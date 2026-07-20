import { calculate, endsWithOperator, MAX_EXPRESSION_LENGTH } from "./calculate";

describe("calculate", () => {
  test("adds floats", () => {
    expect(calculate("12.5 + 3.5")).toBe(16);
  });

  test("division by zero returns Error", () => {
    expect(calculate("8 / 0")).toBe("Error");
  });

  test("preserves left-to-right evaluation", () => {
    expect(calculate("2 + 3 * 4")).toBe(20);
  });

  test("malformed tokens return Error", () => {
    expect(calculate("a + 1")).toBe("Error");
  });

  test("unknown operator returns Error", () => {
    expect(calculate("2 ^ 3")).toBe("Error");
  });
});

describe("endsWithOperator", () => {
  test("detects trailing operator suffixes", () => {
    expect(endsWithOperator("5 + ")).toBe(true);
    expect(endsWithOperator("5 -")).toBe(true);
    expect(endsWithOperator("5 * ")).toBe(true);
    expect(endsWithOperator("5 / ")).toBe(true);
    expect(endsWithOperator("5 + 3")).toBe(false);
  });
});

describe("MAX_EXPRESSION_LENGTH", () => {
  test("is 64 characters", () => {
    expect(MAX_EXPRESSION_LENGTH).toBe(64);
  });
});
