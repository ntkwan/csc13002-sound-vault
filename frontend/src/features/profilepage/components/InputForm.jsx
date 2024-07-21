import { useState, memo } from 'react';
import { HideIcon, NoHideIcon } from '@components/index';

const InputForm = memo(
    ({ placeholder, initValue = '', isPassword = false, type = 'text' }) => {
        const [value, setValue] = useState(initValue);
        const [isHidden, setIsHidden] = useState(true);
        const toggleVisibility = () => setIsHidden(!isHidden);
        const handleChange = (e) => setValue(e.target.value);
        return (
            <div className="relative">
                <input
                    className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    type={isPassword && isHidden ? 'password' : type}
                    autoComplete={isPassword ? 'new-password' : 'off'}
                />
                {isPassword && (
                    <div
                        className="absolute right-4 top-1/2 -translate-y-1/2 scale-75 transform cursor-pointer text-xl"
                        onClick={toggleVisibility}
                    >
                        {isHidden ? <HideIcon /> : <NoHideIcon />}
                    </div>
                )}
            </div>
        );
    },
);

export default InputForm;
