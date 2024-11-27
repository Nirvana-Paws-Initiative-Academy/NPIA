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
          type={type }
          id={id || ""}
          placeholder={""}
          className="peer w-full border border-[#8DB68E] p-2 pl-12 rounded-lg bg-[#fdfffd] focus:border-[#4B714C] focus:outline-none transition-colors duration-300 ease-in-out  font-medium text-md "
          required={required}
          name={name}
        />
        <label
          htmlFor={id || ""}
          className="absolute left-12 transition-all duration-300 transform  font-medium text-[#8DB68E] peer-placeholder-shown:top-2 peer-placeholder-shown:text-md peer-placeholder-shown:text-[#8DB68E] peer-focus:-top-0 peer-focus:text-sm peer-focus:text-[#4B714C] peer-placeholder-shown: "
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
