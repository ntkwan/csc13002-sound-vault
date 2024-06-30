import PropTypes from 'prop-types';

Slider.propTypes = {
    value: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func,
};

function Slider(props) {
    const { value, max } = props;
    return (
        <div className="relative h-1 w-full">
            <div className="absolute h-full w-full rounded-full bg-gray-600"></div>
            <input
                type="range"
                min={0}
                step="any"
                {...props}
                className="slider peer absolute z-20 h-full w-full cursor-pointer appearance-none rounded-full bg-transparent"
            />
            <div
                className="absolute z-10 h-full rounded-full bg-white peer-hover:bg-teal-500"
                style={{
                    width: `${(value / max) * 100}%`,
                }}
            ></div>
        </div>
    );
}

export default Slider;
