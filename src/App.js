import React, { useState, useEffect, useCallback, useRef } from "react";
import ButtonsContainer from "./components/ButtonsContainer";
import DisplayContainer from "./components/DisplayContainer";
import {
  OPERATORS,
  MAX_EXPRESSION_LENGTH,
  endsWithOperator,
  lastNumberSegment,
  calculate,
} from "./utils/calculate";
import "./styles.css";

function App() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const displayRef = useRef(display);
  displayRef.current = display;

  const handleDigit = useCallback((digit) => {
    setDisplay((prev) => {
      const next = prev + String(digit);
      if (next.length > MAX_EXPRESSION_LENGTH) return prev;
      return next;
    });
    setResult("");
  }, []);

  const handleDecimal = useCallback(() => {
    setDisplay((prev) => {
      const segment = lastNumberSegment(prev);
      if (segment.includes(".")) return prev;
      let addition = ".";
      if (prev === "" || endsWithOperator(prev) || prev.endsWith(" ")) {
        addition = "0.";
      }
      if ((prev + addition).length > MAX_EXPRESSION_LENGTH) return prev;
      return prev + addition;
    });
    setResult("");
  }, []);

  const operatorClick = useCallback((operator) => {
    setDisplay((prev) => {
      if (prev === "" || endsWithOperator(prev)) return prev;
      const normalized = prev.trimEnd();
      const next = `${normalized} ${operator} `;
      if (next.length > MAX_EXPRESSION_LENGTH) return prev;
      return next;
    });
    setResult("");
  }, []);

  const handleEqual = useCallback(() => {
    const prev = displayRef.current;
    if (!prev || endsWithOperator(prev)) return;
    const value = calculate(prev);
    setResult(value === "" ? "" : String(value));
  }, []);

  const clear = useCallback(() => {
    setDisplay("");
    setResult("");
  }, []);

  const backspace = useCallback(() => {
    setDisplay((prev) => prev.slice(0, -1));
    setResult("");
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
      } else if (key === "Escape") {
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
