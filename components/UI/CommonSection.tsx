import Image, { StaticImageData } from "next/image";
import React from "react";

interface CommonSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  src?: StaticImageData;
  id?: string;
  withImage?: boolean;
}

export const CommonSection: React.FunctionComponent<CommonSectionProps> = ({
  title,
  description,
  withImage,
  id,
  src,
}) => {
  return (
    <section
      id={id}
      className="flex flex-col items-center justify-center h-[100vh]"
    >
      <div className="common-section-info flex flex-col items-center justify-center gap-4">
        <h1 className="text-[#4B714C] text-4xl tracking-tight font-bold text-center">
          {title}
        </h1>
        <p className="w-full sm:w-4/5 text-[#4B714C] text-center text-2xl font-[500]">
          {description}
        </p>
        {withImage && (
          <div className="common-section-img">
            <Image
              src={src ? src : ""}
              alt={title}
              className="w-full sm:w-[80vw] m-auto h-auto object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
};
