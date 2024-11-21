import { cn } from "@/helper";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
  size: "large" | "small" | "medium";
  isStretched?: boolean;
  id?: string;
  label?: string;
  key?: number | string;
  hover?: string;
  className?: string;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  variant,
  size,
  isStretched,
  id,
  label,
  children,
  key,
  hover,
  className,
}) => {
  return (
    <button
      className={cn(
        // base class for all buttons
        "flex items-center justify-center",
        // style based on sizes
        size === "small" && "px-1 py-1 rounded-md gap-1.5 shadow-sm text-md",
        size === "medium" && "px-6 py-2 rounded-lg gap-2 shadow-md text-lg",
        size === "large" && "px-4 py-2 rounded-xl gap-2.5 text-xl ",
        ` ${className}`,

        //style based on variant
        variant === "primary" &&
          `bg-[#4B714C] ${hover} active:scale-90 text-[#FAFFFD] font-[400] transition duration-200 hover:bg-transparent border hover:border-green-950 hover:text-green-700 clickable`,
        variant === "secondary" &&
          `bg-zinc-800 ${hover} active:scale-90 text-white tracking-tighter clickable`,

        // style based on isStretched
        isStretched && "w-full"
      )}
      aria-label={label}
      id={id}
      key={key}
    >
      {children}
    </button>
  );
};

export default Button;
