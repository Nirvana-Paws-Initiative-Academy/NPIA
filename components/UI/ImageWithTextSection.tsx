import Image, { StaticImageData } from "next/image";
import React from "react";

interface ImageWithTextSection extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  src: StaticImageData;
  id?: string;
  className?: string;
  alt: string;
  textClassName?: string;
}

export const ImageWithTextSection: React.FC<ImageWithTextSection> = ({
  title,
  description,
  src,
  id,
  alt,
  className,
  textClassName,
}) => {
  return (
    <>
      <div className={`flex justify-around items-center ${className}`} id={id}>
        <div
          className={
            "w-full sm:w-2/5 p-[1vw] flex flex-col gap-[.8vw]  " + textClassName
          }
        >
          <h2 className="text-[#4B714C] font-bold text-4xl sm:text-[clamp(1.2rem,2vw,10rem)] ">
            {title}
          </h2>
          <p className="text-[#8DB68E]  text-xl capitalize sm:text-[clamp(1rem,1.5vw,8rem)] leading-none ">
            {description}
          </p>
        </div>
        <div>
          <Image
            src={src}
            alt={alt}
            className="w-full sm:w-[20vw] object-contain"
          />
        </div>
      </div>
    </>
  );
};
