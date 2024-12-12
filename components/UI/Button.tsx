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
  onClick?: () => void;
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
  onClick,
}) => {
  return (
    <button
      className={cn(
        // base class for all buttons
        "flex items-center justify-center",
        // style based on sizes
        size === "small" && "px-[.3vw] py-[.3vw] rounded-md gap-1.5  text-md",
        size === "medium" &&
          "px-[1.6vw] sm:px-[1vw] py-[.6vw] rounded-lg gap-2  text-lg",
        size === "large" &&
          "px-[1vw] py-[.8vw] rounded-xl gap-2.5 text-xl sm:text-[clamp(.4rem,1.6vw,7rem)]",
        ` ${className}`,

        //style based on variant
        variant === "primary" &&
          `bg-[#4B714C] ${hover} active:scale-90 text-[#FAFFFD] font-[400] transition duration-200 hover:bg-transparent hover:border hover:border-green-950 hover:text-green-700 clickable`,
        variant === "secondary" &&
          `bg-white text-slate-700 ${hover} active:scale-90  tracking-tighter clickable`,

        // style based on isStretched
        isStretched && "w-full"
      )}
      aria-label={label}
      id={id}
      key={key}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
