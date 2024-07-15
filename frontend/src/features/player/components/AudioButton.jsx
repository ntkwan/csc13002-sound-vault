import PropTypes from 'prop-types';

AudioButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

function AudioButton({ onClick, children, ...props }) {
    const className = `audio-button text-[#a7a7a7] hover:brightness-150 ${props.className}`;
    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
}

export default AudioButton;
