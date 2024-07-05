import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { play, pause } from '../slices';
import { selectCurrentPlayer } from '@services/selectors';

function useSpacebar() {
    const dispatch = useDispatch();
    const { isPlaying } = useSelector(selectCurrentPlayer);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const activeElement = document.activeElement;
            const isInputField =
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'BUTTON' ||
                activeElement.isContentEditable;
            if (e.code === 'Space' && !isInputField) {
                e.preventDefault();
                if (isPlaying) {
                    dispatch(pause());
                } else {
                    dispatch(play());
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch, isPlaying]);
}

export default useSpacebar;
