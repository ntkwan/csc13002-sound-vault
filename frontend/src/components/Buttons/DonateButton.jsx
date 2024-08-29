import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { AudioButton } from '@features/player/components';

function DonateButton({ openDonateModal, className, song, artist }) {
    return (
        <AudioButton
            className={twMerge('text-2xl', className)}
            onClick={openDonateModal}
        >
            <i
                className="bx bxs-dollar-circle transition-all duration-75 ease-in hover:scale-125"
                data-title={`Donate for ${song} by ${artist}`}
            ></i>
        </AudioButton>
    );
}

DonateButton.propTypes = {
    openDonateModal: PropTypes.func.isRequired,
    className: PropTypes.string,
    song: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
};

export default DonateButton;
