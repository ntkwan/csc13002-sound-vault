import { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { HideIcon, NoHideIcon } from '@components/index';

FormInput.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    isHiden: PropTypes.bool,
    haveIcon: PropTypes.bool,
    value: PropTypes.string,
    action: PropTypes.func.isRequired,
    error: PropTypes.string,
};

function FormInput({ isHiden = true, haveIcon = false, action, ...props }) {
    const { type, error } = props;
    const [isHidden, setIsHidden] = useState(isHiden);
    const [focused, setFocused] = useState(false);
    const [blured, setBlured] = useState(false);

    useLayoutEffect(() => {
        if (props.value !== '' && blured) {
            setFocused(true);
        } else if (props.value === '' && blured) {
            setFocused(false);
        }
    }, [props.value, blured]);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };
    return (
        <>
            <div className="input-bar relative mt-4">
                <input
                    {...props}
                    onChange={action}
                    onBlur={() => setBlured(true)}
                    type={type === 'password' && !isHidden ? 'text' : type}
                    className="font-poppins h-[50px] w-full rounded-[12px] border-none bg-[#383838] p-4 pr-12 text-[13.6px] text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md outline-none"
                />
                {type === 'password' && haveIcon && (
                    <div
                        className="absolute right-4 top-1/2 -translate-y-1/2 scale-75 transform cursor-pointer text-xl"
                        onClick={toggleVisibility}
                    >
                        {isHidden ? <HideIcon /> : <NoHideIcon />}
                    </div>
                )}
            </div>
            {focused && (
                <span className="error-msg ml-2 hidden text-sm font-bold text-red-500">
                    {error}
                </span>
            )}
        </>
    );
}

export default FormInput;
