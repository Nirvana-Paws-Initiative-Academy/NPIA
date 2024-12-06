import Image, { StaticImageData } from "next/image";
import React from "react";

// Define the structure for each image item
interface ImageItem {
  id: number;
  name: string;
  src: StaticImageData; // Path or URL to the image
}

interface ImagesWithTextProps {
  title: string;
  description: string;
  label: string;
  image: StaticImageData | ImageItem[]; // image can be a single item or an array of items
}

export const ImagesWithText: React.FC<ImagesWithTextProps> = ({
  title,
  description,
  image,
  label,
}) => {
  // Check if image is an array or a single image
  const isArray = Array.isArray(image);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-[2vh]">
      <h2 className="text-4xl text-[#4B714C]  sm:text-[clamp(1rem,2vw,10rem)]">{title}</h2>

      <div className="flex flex-wrap items-stretch justify-center gap-4">
        {isArray ? (
          // If it's an array, loop through and display each image
          image.map((jr, index) => (
            <React.Fragment key={index}>
              <div className="w-[250px] sm:w-[16vw] h-[50vh] bg-[#E2FFE4] flex flex-col items-center justify-between ">
                <h2 className="text-[#4B714C] font-bold text-xl mt-[4vh] sm:text-[clamp(.5rem,1.4vw,8rem)]">
                  {jr.name}
                </h2>
                <Image
                  src={jr.src} // Valid for StaticImageData
                  alt={jr.id + jr.name}
                  className="w-[150px] sm:w-[12vw] h-auto object-cover self-auto"
                />
              </div>
            </React.Fragment>
          ))
        ) : (
          // If it's a single image, render it directly
          <Image
            src={image} // Valid for StaticImageData
            alt={label}
            className="w-[400px] sm:w-[30vw] h-auto object-contain"
          />
        )}
      </div>

      <p className="text-[#8DB68E] font-bold text-xl mt-4 text-center sm:text-[clamp(.5rem,1.4vw,8rem)]">
        {description}
      </p>
    </div>
  );
};
