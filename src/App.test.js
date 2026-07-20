import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

function getExpression() {
  return document.querySelector(".input-field");
}

function getResult() {
  return document.querySelector(".answer-field");
}

describe("App keypad flows", () => {
  test("digit entry updates expression", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    expect(getExpression()).toHaveTextContent("12");
  });

  test("consecutive operators are blocked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "-" }));
    expect(getExpression()).toHaveTextContent("5 +");
  });

  test("trailing operator equals is soft no-op", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "-" }));
    await user.click(screen.getByRole("button", { name: "=" }));
    expect(getExpression()).toHaveTextContent("5 -");
    expect(getResult()).toHaveTextContent("");
  });

  test("8 / 0 shows Error and keeps expression", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "8" }));
    await user.click(screen.getByRole("button", { name: "/" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "=" }));
    expect(getResult()).toHaveTextContent("Error");
    expect(getExpression()).toHaveTextContent("8 / 0");
  });

  test("12 + 3 equals 15 and clears expression", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "=" }));
    expect(getResult()).toHaveTextContent("15");
    expect(getExpression()).toHaveTextContent("");
  });

  test("AC clears expression and result", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "9" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "=" }));
    await user.click(screen.getByRole("button", { name: "AC" }));
    expect(getExpression()).toHaveTextContent("");
    expect(getResult()).toHaveTextContent("");
  });

  test("token-aware backspace removes operator", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: /backspace/i }));
    expect(getExpression()).toHaveTextContent("12");
  });

  test("decimal entry 3.5 + 1.5 = 5", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "." }));
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "." }));
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "=" }));
    expect(getResult()).toHaveTextContent("5");
  });

  test("left-to-right 1 + 2 * 3 = 9", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "*" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "=" }));
    expect(getResult()).toHaveTextContent("9");
  });
});
