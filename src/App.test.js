import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App calculator behaviors", () => {
  test("trailing-operator soft-stop on equals", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: "Equals" }));

    expect(screen.getByText((content) => content.trim() === "5 +")).toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  test("division by zero shows Error", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "8" }));
    await userEvent.click(screen.getByRole("button", { name: "Divide" }));
    await userEvent.click(screen.getByRole("button", { name: "0" }));
    await userEvent.click(screen.getByRole("button", { name: "Equals" }));

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  test("decimal key evaluates floats", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "1" }));
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    await userEvent.click(screen.getByRole("button", { name: "Decimal point" }));
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    await userEvent.click(screen.getByRole("button", { name: "Decimal point" }));
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "Equals" }));

    expect(screen.getByText("16")).toBeInTheDocument();
  });

  test("Enter key equals matches on-screen equals", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "7" }));
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: "8" }));
    fireEvent.keyDown(window, { key: "Enter" });

    expect(screen.getByText("15")).toBeInTheDocument();
  });
});
