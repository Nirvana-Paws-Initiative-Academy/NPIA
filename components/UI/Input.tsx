import { Icon } from "./Icons";

interface InputProps {
  name: string;
  label: string;
  type: string;
  id: string;
  required: boolean;
  icon: string;
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  type = "text",
  id,
  required = true,
  icon,
}) => {
  return (
    <>
      <div className="relative w-full">
        <input
          type={type}
          id={id || ""}
          placeholder={""}
          className="peer w-full border border-[#8DB68E] p-[.8vw] pl-[3vw] rounded-[.4vw] bg-[#fdfffd] focus:border-[#4B714C] focus:outline-none transition-colors duration-300 ease-in-out  font-medium text-md sm:text-[clamp(.4rem,1.2vw,3rem)]"
          required={required}
          name={name}
        />
        <label
          htmlFor={id || ""}
          className="absolute left-[3vw]  transition-all duration-300 transform  font-medium text-[#8DB68E] peer-placeholder-shown:top-[1.5vh] 4xl:peer-placeholder-shown:top-[.5vh] peer-placeholder-shown:sm:text-[clamp(.7rem,1.3vw,6rem)] peer-placeholder-shown:text-[#8DB68E] peer-focus:-top-0 peer-focus:text-[clamp(.7rem,1.3vw,4rem)] peer-focus:text-[#4B714C] text-[clamp(.7rem,1.3vw,4rem)]"
        >
          {label}
        </label>
        <p className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
          <Icon name={icon} />
        </p>
      </div>
    </>
  );
};
