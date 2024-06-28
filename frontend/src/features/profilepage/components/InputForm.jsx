import { useState, memo } from "react";

import hide from "@assets/img/hide.svg";
import nohide from "@assets/img/nohide.svg";

const InputForm = memo(({ placeholder, value, onChange, isPassword = false, type = "text" }) => {
    const [isHidden, setIsHidden] = useState(true);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="relative">
            <input
                className="w-full h-[50px] px-4 rounded-xl shadow-md bg-[#383838] 
                     focus:outline-none focus:ring-0 focus:ring-white placeholder:text-[#a5a5a5]"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                type={isPassword && isHidden ? "password" : type}
                autoComplete={isPassword ? "new-password" : "off"}
            />
            {isPassword && (
                <img
                    src={isHidden ? hide : nohide}
                    alt={isHidden ? "Hide" : "Show"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 scale-75 transform cursor-pointer text-xl"
                    onClick={toggleVisibility}
                />
            )}
        </div>
    );
});

export default InputForm;