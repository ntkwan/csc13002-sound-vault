import PropTypes from 'prop-types';
import { Loading } from '@components';

ConfirmButton.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
};

function ConfirmButton({ isLoading, title, disabled }) {
    return (
        <button
            type="submit"
            className="flex h-[49px] flex-1 cursor-pointer items-center justify-center rounded-[12px] bg-[#383838] text-[#fcfcfc] shadow-md hover:scale-105 hover:opacity-75 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-75"
            disabled={disabled || isLoading}
        >
            {isLoading ? <Loading className="mr-2 h-5 w-5" /> : null}
            <span className="font-kodchasan text-[13.5px]">{title}</span>
        </button>
    );
}

export default ConfirmButton;
