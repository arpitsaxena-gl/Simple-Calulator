import React, { useState, useEffect, useCallback, useRef } from "react";
import ButtonsContainer from "./components/ButtonsContainer";
import DisplayContainer from "./components/DisplayContainer";
import "./styles.css";

const OPERATORS = ["+", "-", "*", "/"];

function endsWithOperator(expression) {
  const trimmed = expression.trimEnd();
  return OPERATORS.some(
    (op) => trimmed.endsWith(` ${op}`) || trimmed.endsWith(` ${op} `)
  );
}

function lastNumberSegment(expression) {
  const parts = expression.trim().split(" ");
  return parts[parts.length - 1] || "";
}

function App() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const displayRef = useRef(display);
  displayRef.current = display;

  const handleDigit = useCallback((digit) => {
    setDisplay((prev) => prev + String(digit));
    setResult("");
  }, []);

  const handleDecimal = useCallback(() => {
    setDisplay((prev) => {
      const segment = lastNumberSegment(prev);
      if (segment.includes(".")) return prev;
      if (prev === "" || endsWithOperator(prev) || prev.endsWith(" ")) {
        return prev + "0.";
      }
      return prev + ".";
    });
    setResult("");
  }, []);

  const operatorClick = useCallback((operator) => {
    setDisplay((prev) => {
      if (prev === "" || endsWithOperator(prev)) return prev;
      const normalized = prev.trimEnd();
      return `${normalized} ${operator} `;
    });
    setResult("");
  }, []);

  const calculate = useCallback((expression) => {
    const tokens = expression.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return "";

    let resultValue = parseFloat(tokens[0]);
    if (Number.isNaN(resultValue)) {
      throw new Error("Invalid expression");
    }

    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const nextNumber = parseFloat(tokens[i + 1]);

      if (Number.isNaN(nextNumber)) {
        throw new Error("Invalid expression");
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
            throw new Error("Division by zero");
          }
          resultValue /= nextNumber;
          break;
        default:
          throw new Error("Unknown operator");
      }
    }

    if (!Number.isFinite(resultValue)) {
      throw new Error("Invalid result");
    }

    return Number(Number(resultValue.toPrecision(12)).toString());
  }, []);

  const handleEqual = useCallback(() => {
    const prev = displayRef.current;
    if (!prev || endsWithOperator(prev)) return;
    try {
      setResult(String(calculate(prev)));
    } catch {
      setResult("Error");
    }
  }, [calculate]);

  const clear = useCallback(() => {
    setDisplay("");
    setResult("");
  }, []);

  const backspace = useCallback(() => {
    setDisplay((prev) => prev.slice(0, -1));
  }, []);

  const handleClick = useCallback(
    (e) => {
      const targetValue = e.currentTarget.name;
      if (targetValue === ".") {
        handleDecimal();
        return;
      }
      handleDigit(targetValue);
    },
    [handleDecimal, handleDigit]
  );

  useEffect(() => {
    function onKeyDown(event) {
      const { key } = event;
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleDigit(key);
      } else if (key === ".") {
        event.preventDefault();
        handleDecimal();
      } else if (OPERATORS.includes(key)) {
        event.preventDefault();
        operatorClick(key);
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleEqual();
      } else if (key === "Backspace") {
        event.preventDefault();
        backspace();
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        event.preventDefault();
        clear();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDigit, handleDecimal, operatorClick, handleEqual, backspace, clear]);

  return (
    <div className="page">
      <div className="page-glow" aria-hidden="true" />
      <main className="container">
        <header className="brand">
          <p className="brand-name">Simple Calculator</p>
          <p className="brand-tagline">Fast arithmetic, clean keypad</p>
        </header>
        <div className="calculator" role="application" aria-label="Calculator">
          <DisplayContainer
            display={display}
            result={result}
            backspace={backspace}
            clear={clear}
          />
          <ButtonsContainer
            operatorClick={operatorClick}
            handleClick={handleClick}
            handleEqual={handleEqual}
            handleDecimal={handleDecimal}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
