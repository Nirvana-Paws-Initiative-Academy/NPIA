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
        <div className={"w-full sm:w-2/5 p-2  " + textClassName}>
          <h2 className="text-[#4B714C] font-bold text-3xl">{title}</h2>
          <p className="text-[#8DB68E] text-lg sm:text-xl capitalize ">
            {description}
          </p>
        </div>
        <div>
          <Image
            src={src}
            alt={alt}
            className="w-[200px] sm:w-[300px] object-contain"
          />
        </div>
      </div>
    </>
  );
};
