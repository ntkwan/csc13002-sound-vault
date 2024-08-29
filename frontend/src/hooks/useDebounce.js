import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

useDebounce.propTypes = {
    value: PropTypes.any,
    delay: PropTypes.number,
};

export default useDebounce;
