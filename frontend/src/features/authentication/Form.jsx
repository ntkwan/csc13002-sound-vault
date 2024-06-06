import { useState } from 'react';
import PropTypes from 'prop-types';
import hide from '@assets/img/hide.svg'
import nohide from '@assets/img/nohide.svg'
Form.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    isHiden: PropTypes.bool,
    haveIcon: PropTypes.bool,
};

Form.defaultProps = {
    isHiden: true,
    haveIcon: false,
}
function Form(props) {
    const { type, placeholder, haveIcon, isHiden, action } = props;
    const [isHidden, setIsHidden] = useState(isHiden);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    return (
        <div className="relative mt-4">
            <input
                type={type === 'password' && !isHidden ? 'text' : type}
                placeholder={placeholder}
                required
                className="font-poppins text-[13.6px] w-full h-[50px] bg-[#383838] border-none outline-none rounded-[12px] p-4 pr-12 text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md"
                onChange={action}
            />
            {type === 'password' && haveIcon && (
                <img
                    src={isHidden ? hide : nohide}
                    alt={isHidden ? "Hide" : "Show"}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl scale-75 cursor-pointer"
                    onClick={toggleVisibility}
                />
            )}
        </div>
    );
}

export default Form;