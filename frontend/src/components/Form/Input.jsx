import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { Eye, EyeSlash } from "..";

function Input(props) {
  const { type, placeholder, onChange } = props;
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    console.log(showPassword);
  }, [showPassword]);
  return (
    <div className="relative mt-4">
      <input
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        onChange={onChange}
        className="h-12 w-full rounded-xl border-none bg-[#383838] p-4 font-kodchasan text-[13.6px] font-bold text-[#fcfcfc] placeholder-neutral-400 shadow-md outline-none hover:bg-[#4C4C4D]"
      />
      {type === "password" && (
        <div
          className="absolute right-4 top-3 transform cursor-pointer text-[#a6a6a6] transition-all hover:scale-105 hover:text-[#fcfcfc] active:scale-105 active:text-[#a6a6a6]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye /> : <EyeSlash />}
        </div>
      )}
    </div>
  );
}

Input.propTypes = {
  type: propTypes.string.isRequired,
  placeholder: propTypes.string,
  onChange: propTypes.func,
};

export default Input;
