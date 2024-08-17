import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDonateMutation } from '@services/api';
import Modal from './Modal';

function DonateModal(props) {
    const balance = props.balance;
    const [amount, setAmount] = useState(0);
    const handleAmountChange = (e) => {
        const value = parseInt(e.target.value.replace(/,/g, ''), 10);
        if (isNaN(parseInt(value))) {
            setAmount(0);
            return;
        }
        setAmount(Math.max(0, Math.min(parseInt(value), balance)));
    };

    const [donate] = useDonateMutation();
    const handleDonate = async () => {
        try {
            const res = await donate({
                amount,
                to: props.artist,
                song: props.song,
            }).unwrap();
            toast.success(res.message);
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    return (
        <Modal closeModal={props.closeDonateModal}>
            <Modal.Donate
                balance={balance}
                song={props.song}
                artist={props.artist}
                amount={amount}
                handleAmountChange={handleAmountChange}
                handleDonate={handleDonate}
                openDepositModal={props.openDepositModal}
            />
        </Modal>
    );
}

DonateModal.propTypes = {
    balance: PropTypes.number.isRequired,
    song: PropTypes.string,
    artist: PropTypes.string,
    closeDonateModal: PropTypes.func.isRequired,
    openDepositModal: PropTypes.func.isRequired,
};

export default DonateModal;
