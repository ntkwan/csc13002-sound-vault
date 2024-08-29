import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

AudioButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};
function AudioButton({ onClick, children, ...props }) {
    const className = twMerge(
        'text-[#a7a7a7] brightness-50',
        !props.disabled &&
            twMerge('brightness-100 hover:brightness-150', props.className),
    );
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
