import PropTypes from 'prop-types';

ManagementButtons.propTypes = {
    background: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    disable: PropTypes.bool,
};

function ManagementButtons({ background, onClick, children, disable }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-4 py-1 text-black duration-300 ease-in-out hover:scale-110 ${background} hover:bg-opacity-80 hover:text-white ${disable ? 'cursor-not-allowed bg-slate-500 opacity-50' : ''}`}
        >
            {children}
        </button>
    );
}

export default ManagementButtons;
