import React from "react";

function DisplayContainer({ display, result, backspace, clear }) {
  return (
    <div className="display-container">
      <div className="display" aria-live="polite" aria-atomic="true">
        <div className="input-field" data-empty={!display}>
          {display || "0"}
        </div>
        <div
          className={`answer-field${result ? " has-result" : ""}${
            result === "Error" ? " result--error" : ""
          }`}
        >
          {result !== "" ? String(result) : "\u00A0"}
        </div>
      </div>
      <div className="other-btns">
        <button
          type="button"
          className="calc-btn util-btn"
          onClick={backspace}
          aria-label="Backspace"
        >
          <span className="calc-btn-label" aria-hidden="true">
            ⌫
          </span>
        </button>
        <button
          type="button"
          className="calc-btn util-btn AC-btn"
          onClick={clear}
          aria-label="All clear"
        >
          <span className="calc-btn-label">AC</span>
        </button>
      </div>
    </div>
  );
}

export default DisplayContainer;
