import PropTypes from 'prop-types';

ManagementButtons.propTypes = {
    background: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
};

function ManagementButtons({ background, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-4 py-1 text-black ${background} hover:bg-opacity-80 hover:text-white`}
        >
            {children}
        </button>
    );
}

export default ManagementButtons;
