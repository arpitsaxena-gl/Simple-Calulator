import React from "react";

function Button({ handleClick, name, value, className }) {
  return (
    <>
      <button className={className} onClick={handleClick} name={name}>
        {value}
      </button>
    </>
  );
}

export default Button;
