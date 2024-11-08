import Image, { StaticImageData } from "next/image";
import React, { forwardRef } from "react";

interface CommonSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  smallDescription?: string; // New prop for small description
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
      smallDescription, // Include the new prop
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
        className="flex flex-col items-center justify-center mt-[2vh] "
      >
        <div className="common-section-info flex flex-col items-center justify-around gap-[1vw] min-h-screen">
          <div className="flex items-center flex-col gap-7 sm:gap-[1vw] p-4">
            <h1 className="text-[#4B714C] text-4xl tracking-tight font-bold text-center">
              {title}
            </h1>

            {/* Full description for small screens when smallScreenDescription is false */}
            <p
              className={`w-full sm:w-4/5 text-[#4B714C] text-center text-lg sm:text-2xl font-[500] hidden sm:block`}
            >
              {description}
            </p>

            {/* Shortened description for small screens */}
            {smallScreenDescription && (
              <p className="flex sm:hidden w-full sm:w-4/5 text-[#4B714C] text-center text-xl sm:text-2xl font-[500] flex-col gap-4">
                {smallDescription || (
                  <>
                    In the bustling streets of India, millions of stray puppies
                    face a daily struggle for survival. Sadly, only a fraction
                    of these vulnerable creatures reach adulthood. <br />
                    <span>
                      Disease, hunger, accidents, and cruelty claim far too many
                      young lives. Nirvana Paws Initiative & Academy is
                      dedicated to changing this reality.
                    </span>
                  </>
                )}
              </p>
            )}
          </div>
          {withImage && (
            <div className="common-section-img w-screen">
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
                      className="w-[60%] sm:hidden m-auto h-auto object-contain"
                    />
                  )}
                  {/* Render the large image for medium and larger screens */}
                  {largeSrc && (
                    <Image
                      src={largeSrc}
                      alt={title}
                      className="hidden sm:block w-[70%] m-auto h-auto object-contain"
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
