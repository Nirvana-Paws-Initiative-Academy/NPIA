import { cn } from "@/helper";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size: "large" | "small" | "medium";
  id?: string;
  label?: string;
  key: number | string;
  hover?: string;
}

const Card: React.FunctionComponent<CardProps> = ({
  size,
  id,
  label,
  children,
  key,
  hover,
}) => {
  return (
    <button
      className={cn(
        // base class for all buttons
        "flex items-center justify-center",

        // style based on sizes
        size === "small" && "px-1 py-1 rounded-md gap-1.5 shadow-sm",
        size === "medium" && "px-6 py-2 rounded-lg gap-2 shadow-md",
        size === "large" && "px-7 py-2 rounded-xl gap-2.5 shadow-lg"
      )}
      aria-label={label}
      id={id}
      key={key}
    >
      {children}
    </button>
  );
};

export default Card;
