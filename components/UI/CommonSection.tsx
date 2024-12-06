import Image, { StaticImageData } from "next/image";
import React, { forwardRef } from "react";

interface CommonSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  smallDescription?: React.ReactNode; // New prop for small description
  smallSrc?: StaticImageData; // For small screens
  smallScreenDescription?: boolean; // Optional prop
  largeSrc?: StaticImageData; // For medium and large screens
  id?: string;
  withImage?: boolean;
}

export const CommonSection = forwardRef<HTMLDivElement, CommonSectionProps>(
  (
    {
      title,
      description,
      smallDescription,
      withImage,
      id,
      smallSrc,
      largeSrc,
      smallScreenDescription = false, // Default to false
    },
    ref
  ) => {
    const isSingleImage = !smallSrc && largeSrc; // Check if only largeSrc is provided

    return (
      <section
        ref={ref}
        id={id}
        className="flex flex-col items-center justify-center"
      >
        <div className="common-section-info flex flex-col items-center justify-center sm:justify-around gap-[1vw] min-h-screen">
          <div className="flex items-center flex-col gap-7 sm:gap-[1vw] p-4">
            <h1 className="text-[#4B714C] text-5xl tracking-tight font-bold text-center sm:text-[clamp(1rem,4vw,12rem)]">
              {title}
            </h1>

            {/* Full description for small screens when smallScreenDescription is false */}
            <p
              className={`w-full sm:w-4/5 text-[#4B714C] text-center text-lg sm:text-[clamp(1.3rem,1.6vw,9rem)] leading-snug font-[500] ${smallDescription ? "hidden" : "block"} `}
            >
              {description}
            </p>

            {/* Shortened description for small screens */}
            {smallScreenDescription && (
              <p className="flex sm:hidden w-full sm:w-4/5 text-[#4B714C] text-center text-xl sm:text-2xl font-[500] flex-col gap-4">
                {smallDescription}
              </p>
            )}
          </div>
          {withImage && (
            <div className="common-section-img w-full">
              {/* Render the single image for both small and large screens */}
              {isSingleImage ? (
                largeSrc && (
                  <Image
                    src={largeSrc}
                    alt={title}
                    className="w-[100%] m-auto h-auto object-contain"
                  />
                )
              ) : (
                <>
                  {/* Render the small image for small screens */}
                  {smallSrc && (
                    <Image
                      src={smallSrc}
                      alt={title}
                      className="w-[80%] sm:hidden m-auto h-auto object-contain "
                    />
                  )}
                  {/* Render the large image for medium and larger screens */}
                  {largeSrc && (
                    <Image
                      src={largeSrc}
                      alt={title}
                      className="hidden sm:block w-[60%] 4xl:w-[60vw] m-auto h-auto object-cover"
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }
);

CommonSection.displayName = "CommonSection";
