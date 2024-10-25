import Image, { StaticImageData } from "next/image";
import React, { forwardRef } from "react";
interface CommonSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  smallSrc?: StaticImageData; // For small screens
  largeSrc?: StaticImageData; // For medium and large screens
  id?: string;
  withImage?: boolean;
  smallScreenDescription?: string;
}

export const CommonSection = forwardRef<HTMLDivElement, CommonSectionProps>(
  (
    {
      title,
      description,
      withImage,
      id,
      smallSrc,
      largeSrc,
      smallScreenDescription,
    },
    ref
  ) => {
    const isSingleImage = !smallSrc && largeSrc; // Check if only largeSrc is provided

    return (
      <section
        ref={ref}
        id={id}
        className="flex flex-col items-center justify-center min-h-screen mb-[]"
      >
        <div className="common-section-info flex flex-col items-center justify-center h-screen  gap-[4vw]">
          <div className="flex items-center flex-col gap-[1vw]">
            <h1 className="text-[#4B714C] text-4xl tracking-tight font-bold text-center">
              {title}
            </h1>
            <p className="w-full sm:w-4/5 text-[#4B714C] text-center text-2xl font-[500]">
              {description}
            </p>
            {smallScreenDescription && (
              <p className="w-full sm:w-4/5 text-[#4B714C] text-center text-2xl font-[500]">
                {smallScreenDescription}
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
                    className="w-[60%] m-auto h-auto object-contain"
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
                      className="hidden sm:block w-[80vw] m-auto h-auto object-contain"
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
