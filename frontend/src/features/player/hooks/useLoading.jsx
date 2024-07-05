import { useState } from 'react';
import PropTypes from 'prop-types';

function useLoading(loadingTime = 2000) {
    const [isLoading, setIsLoading] = useState(false);
    const setLoading = () => {
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, loadingTime);
        return () => clearTimeout(timeoutId);
    };
    return [isLoading, setLoading];
}

useLoading.propTypes = {
    loadingTime: PropTypes.number,
};

export default useLoading;
