import { useEffect, useState, useRef } from 'react';

function useMouseMove() {
    const timeout = useRef(null);
    const [isMouseMoved, setIsMouseMoved] = useState(false);

    useEffect(() => {
        const handleMouseMove = () => {
            setIsMouseMoved(true);
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                setIsMouseMoved(false);
            }, 2000);
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return isMouseMoved;
}

export default useMouseMove;
