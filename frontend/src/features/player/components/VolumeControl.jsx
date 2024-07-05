import { useState } from 'react';
import PropTypes from 'prop-types';
import { setVolume } from '../slices';
import AudioButton from './AudioButton';
import Slider from './Slider';

const VolumeControl = ({ volume, dispatch }) => {
    const [oldVolume, setOldVolume] = useState(volume);

    const handleIconClick = (newVolume) => {
        if (newVolume === 0) {
            dispatch(setVolume(oldVolume));
        } else {
            setOldVolume(volume);
            dispatch(setVolume(0));
        }
    };

    const handleOnChange = (event) => {
        dispatch(setVolume(event.target.value));
    };

    return (
        <div className="flex w-3/12 items-center">
            <AudioButton>
                <i
                    className={
                        volume < 1
                            ? 'ri-volume-mute-fill'
                            : volume <= 40
                              ? 'ri-volume-down-fill'
                              : 'ri-volume-up-fill'
                    }
                    onClick={() => handleIconClick(volume)}
                ></i>
            </AudioButton>
            <Slider max={100} value={volume} onChange={handleOnChange}></Slider>
        </div>
    );
};

VolumeControl.propTypes = {
    volume: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default VolumeControl;
