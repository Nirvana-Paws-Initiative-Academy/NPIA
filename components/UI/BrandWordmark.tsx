import React from "react";

interface BrandWordmarkProps {
  className?: string;
  dotClassName?: string;
}

/** Typographic primary brand wordmark ("NPIA.") used across subpage chrome. */
export function BrandWordmark({
  className = "",
  dotClassName = "text-[#4B714C]",
}: BrandWordmarkProps) {
  return (
    <span
      className={`inline-flex items-baseline font-extrabold tracking-[-0.045em] leading-none text-[#152916] select-none ${className}`}
    >
      NPIA
      <span className={dotClassName} aria-hidden="true">
        .
      </span>
    </span>
  );
}
