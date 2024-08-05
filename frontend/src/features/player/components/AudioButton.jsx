import PropTypes from 'prop-types';

AudioButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

function AudioButton({ onClick, children, ...props }) {
    const className = props.disabled
        ? 'audio-button text-[#a7a7a7] brightness-50'
        : `audio-button text-[#a7a7a7] hover:brightness-150 ${props.className}`;
    onClick = props.disabled ? () => {} : onClick;
    return (
        <button
            onClick={onClick}
            className={className}
            disabled={props.disabled}
        >
            {children}
        </button>
    );
}

export default AudioButton;
