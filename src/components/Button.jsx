import React from "react";

function Button({ handleClick, name, value, className = "", ariaLabel }) {
  return (
    <button
      type="button"
      className={`calc-btn ${className}`.trim()}
      onClick={handleClick}
      name={name}
      aria-label={ariaLabel || String(value)}
    >
      <span className="calc-btn-label">{value}</span>
    </button>
  );
}

export default Button;
