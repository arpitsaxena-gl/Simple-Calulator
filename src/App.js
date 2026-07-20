import React, { useState } from "react";
import ButtonsContainer from "./components/ButtonsContainer";
import DisplayContainer from "./components/DisplayContainer";
import {
  appendDigit,
  appendOperator,
  calculate,
  endsWithOperator,
  formatResult,
  tokenAwareBackspace,
} from "./utils/calculate";
import "./styles.css";

function App() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");

  function handleClick(e) {
    const targetValue = String(e.target.name);
    setDisplay((prev) => appendDigit(prev, targetValue));
  }

  function operatorClick(operator) {
    setDisplay((prev) => appendOperator(prev, operator));
  }

  function handleEqual() {
    setDisplay((prev) => {
      if (prev === "" || endsWithOperator(prev)) {
        return prev;
      }
      const outcome = calculate(prev);
      if (outcome.ok) {
        setResult(formatResult(outcome.value));
        return "";
      }
      setResult("Error");
      return prev;
    });
  }

  function clear() {
    setDisplay("");
    setResult("");
  }

  function backspace() {
    setDisplay((prev) => tokenAwareBackspace(prev));
  }

  return (
    <>
      <div className="container">
        <div className="calculator">
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
          />
          <p className="text-white">Created by Abdur Rehman</p>
        </div>
      </div>
    </>
  );
}

export default App;
