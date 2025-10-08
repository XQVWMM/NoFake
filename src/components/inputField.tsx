import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isDarkMode?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = "",
  icon,
  iconPosition = "right",
  isDarkMode,
}) => {
  const hasIcon = Boolean(icon);
  const iconPaddingClass = hasIcon
    ? iconPosition === "right"
      ? "pl-10"
      : "pr-10"
    : "";

  return (
    <div className="mb-2">
      <label className="block text-[#161F36] mb-1 text-[18px] font-medium dark:text-white">
        {label}
      </label>
      <div className="relative w-full max-w-[486px]">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full p-3 rounded-[16px] border-2 border-black text-[#161F36] 
            focus:outline-none focus:ring-2 focus:ring-[#5CBDB9]
            ${
              readOnly
                ? "bg-[#f9fafb] border-black"
                : "bg-white border-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            } 
            placeholder-gray-500 dark:placeholder-gray-400 ${iconPaddingClass} ${className}`}
        />
        {icon && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              iconPosition === "left" ? "left-3" : "right-3"
            }`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
