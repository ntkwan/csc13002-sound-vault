import PropTypes from 'prop-types';

ConfirmButton.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
};

function ConfirmButton({ title, disabled }) {
    return (
        <button
            type="submit"
            className="flex h-[49px] flex-1 cursor-pointer items-center justify-center rounded-[12px] bg-[#383838] text-[#fcfcfc] shadow-md hover:scale-105 hover:opacity-75 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-75"
            disabled={disabled}
        >
            <span className="font-kodchasan text-[13.5px]">{title}</span>
        </button>
    );
}

export default ConfirmButton;
