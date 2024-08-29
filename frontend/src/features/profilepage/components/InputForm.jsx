import { useState, memo } from 'react';
import { HideIcon, NoHideIcon } from '@components/index';

const InputForm = memo(
    ({
        id,
        placeholder,
        initValue = '',
        isPassword = false,
        isCheck = false,
        type = 'text',
        required = false,
    }) => {
        const [value, setValue] = useState(initValue);
        const [isHidden, setIsHidden] = useState(true);
        const [errorPassword, setErrorPassword] = useState('');

        const toggleVisibility = () => setIsHidden(!isHidden);

        const handleInvalid = (e) => {
            e.preventDefault();
            if (isPassword && isCheck) {
                setErrorPassword(
                    'Password should be at least 6 characters and contain 1 letter, 1 number, and 1 special character!',
                );
            }
        };

        const handleInput = (e) => {
            setValue(e.target.value);
            if (isPassword && e.target.validity.valid) {
                setErrorPassword('');
            }
        };

        return (
            <div>
                <div className="relative">
                    <input
                        className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                        id={id}
                        name={id}
                        value={value}
                        placeholder={placeholder}
                        type={isPassword && isHidden ? 'password' : type}
                        autoComplete={isPassword ? 'new-password' : 'off'}
                        onChange={handleInput}
                        onInvalid={handleInvalid}
                        required={required}
                        pattern={
                            isPassword && isCheck
                                ? '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{6,}$'
                                : undefined
                        }
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
                {errorPassword && (
                    <p className="error-msg ml-1 text-sm font-bold text-red-500">
                        {errorPassword}
                    </p>
                )}
            </div>
        );
    },
);

export default InputForm;
