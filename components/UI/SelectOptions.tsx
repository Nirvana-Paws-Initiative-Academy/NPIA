import React, { useState } from "react";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { Icon } from "./Icons";

type Option = {
  id: string;
  icon: string;
  title: string;
  description: string;
  selected?: boolean;
};

interface SelectOptionsProps {
  options: Option[];
  onChange: (id: string) => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SelectOptions: React.FC<SelectOptionsProps> = ({
  options,
  onChange,
  setShow,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionChange = () => {
    setIsOpen(!isOpen);
    setShow((prev) => !prev);
  };
  return (
    <div className="w-full max-w-2xl mx-auto border border-[#DAF6DA] rounded-lg ">
      {/* Header/Trigger */}
      <div
        className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 clickable"
        onClick={handleOptionChange}
      >
        <div className="flex items-center gap-1 ">
          <div className="h-12 w-12 bg-[#DAF6DA] rounded-lg flex items-center justify-center">
            <Icon name="contact_header_icon" />
          </div>
          <div className="">
            <h2 className="text-md font-medium text-[#4B714C] ">
              Please Select The Following Options
            </h2>
            <p className="text-sm text-[#8DB68E]">
              Connect With Us And Learn More About How You Can Make A Difference
              In The Lives Of Stray Puppies.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Options */}
      {isOpen && (
        <div className="border-t ">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center p-1 hover:bg-gray-50 bg-[#fafffd] cursor-pointer "
              onClick={() => onChange(option.id)}
            >
              <div className="flex-shrink-0 h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-2xl text-green-600">{option.icon}</span>
              </div>

              <div className="ml-4 flex-1">
                <h3 className="text-md  font-bold text-[#4B714C]">
                  {option.title}
                </h3>
                <p className="text-sm text-[#8DB68E]">{option.description}</p>
              </div>

              <div className="ml-4 flex-shrink-0">
                <div
                  className={`h-6 w-6 border rounded-sm flex items-center justify-center
                  ${
                    option.selected
                      ? "bg-green-600 border-green-600"
                      : "border-gray-300"
                  }`}
                >
                  {option.selected && (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
