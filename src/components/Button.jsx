"use client";
import React from "react";

// Small, reusable button. Forward onClick and optional type so callers can use it
const Button = ({
  title,
  id,
  rightIcon,
  leftIcon,
  containerClass,
  onClick,
  type = "button",
  ...rest
}) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black ${containerClass}`}
      {...rest}
    >
      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-sx uppercase">
        <div>{title}</div>
      </span>

      {rightIcon}
    </button>
  );
};

export default Button;
