import PropTypes from 'prop-types';

UtilitiesCard.propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    handleAction: PropTypes.func,
    liClass: PropTypes.string,
    spanClass: PropTypes.string,
};

function UtilitiesCard({ icon, title, handleAction, liClass, spanClass }) {
    return (
        <li
            className={`flex items-center space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-white hover:bg-opacity-25 ${liClass ? liClass : ''}`}
            onClick={handleAction}
        >
            {icon && <i className={`${icon} text-xl leading-none`} />}
            <span className={spanClass ? spanClass : ''}>{title}</span>
        </li>
    );
}

export default UtilitiesCard;
