import {
  appendDigit,
  appendOperator,
  calculate,
  endsWithOperator,
  formatResult,
  tokenAwareBackspace,
} from "./calculate";

describe("endsWithOperator", () => {
  test.each(["+ ", "- ", "* ", "/ "])("true for trailing %s", (op) => {
    expect(endsWithOperator(`5 ${op}`)).toBe(true);
  });

  test("false for complete expression", () => {
    expect(endsWithOperator("5 + 2")).toBe(false);
  });

  test("false for empty", () => {
    expect(endsWithOperator("")).toBe(false);
  });
});

describe("calculate", () => {
  test("happy path addition", () => {
    expect(calculate("12 + 3")).toEqual({ ok: true, value: 15 });
  });

  test("left-to-right not PEMDAS", () => {
    expect(calculate("1 + 2 * 3")).toEqual({ ok: true, value: 9 });
  });

  test("decimals", () => {
    expect(calculate("3.5 + 1.5")).toEqual({ ok: true, value: 5 });
  });

  test("divide by zero", () => {
    expect(calculate("8 / 0")).toEqual({ ok: false, error: "Error" });
  });

  test("trailing operator", () => {
    expect(calculate("5 + ")).toEqual({ ok: false, error: "Error" });
  });

  test("empty", () => {
    expect(calculate("")).toEqual({ ok: false, error: "Error" });
  });

  test("bad token", () => {
    expect(calculate("12 + abc")).toEqual({ ok: false, error: "Error" });
  });

  test("never returns Infinity as value", () => {
    const r = calculate("1 / 0");
    expect(r.ok).toBe(false);
    expect(r.error).toBe("Error");
  });
});

describe("appendDigit", () => {
  test("appends digits", () => {
    expect(appendDigit("1", "2")).toBe("12");
  });

  test("dot on empty becomes 0.", () => {
    expect(appendDigit("", ".")).toBe("0.");
  });

  test("dot after operator becomes 0.", () => {
    expect(appendDigit("3 + ", ".")).toBe("3 + 0.");
  });

  test("rejects duplicate decimal in same number", () => {
    expect(appendDigit("3.1", ".")).toBe("3.1");
  });
});

describe("appendOperator", () => {
  test("appends operator with spaces", () => {
    expect(appendOperator("12", "+")).toBe("12 + ");
  });

  test("no-op when empty", () => {
    expect(appendOperator("", "+")).toBe("");
  });

  test("no-op when trailing operator", () => {
    expect(appendOperator("12 + ", "-")).toBe("12 + ");
  });
});

describe("tokenAwareBackspace", () => {
  test("removes operator token as a whole", () => {
    expect(tokenAwareBackspace("12 + ")).toBe("12");
  });

  test("removes last digit", () => {
    expect(tokenAwareBackspace("12")).toBe("1");
  });
});

describe("formatResult", () => {
  test("integers as plain strings", () => {
    expect(formatResult(15)).toBe("15");
  });

  test("non-finite becomes Error", () => {
    expect(formatResult(Infinity)).toBe("Error");
  });
});
