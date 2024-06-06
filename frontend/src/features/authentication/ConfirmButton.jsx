import PropTypes from 'prop-types';

ConfirmButton.propTypes = {
    title: PropTypes.string.isRequired,
};

function ConfirmButton({ title, action }) {
    return (
        <button
            onClick={action} className="flex-1 flex items-center justify-center h-[49px] bg-[#383838] rounded-[12px] text-[#fcfcfc] shadow-md hover:opacity-75 hover:scale-105 cursor-pointer">
            <span className="font-kodchasan text-[13.5px]">{title}</span>
        </button>
    );
}

export default ConfirmButton;