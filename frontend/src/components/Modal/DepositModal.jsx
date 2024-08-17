import PropTypes from 'prop-types';
import Modal from './Modal';
import { useState } from 'react';
import { useDepositMutation } from '@services/api';
import { toast } from 'react-toastify';

function DepositModal(props) {
    const [amount, setAmount] = useState(10000);
    const handleAmountChange = (e) => {
        setAmount(parseInt(e.target.value));
    };

    let checkoutUrl = '';
    const [deposit] = useDepositMutation();
    const handleDeposit = async () => {
        try {
            const res = await deposit({ amount }).unwrap();
            toast.success(
                `${amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} transfer request sent successfully!`,
            );
            checkoutUrl = res.checkoutUrl;
            window.location.href = checkoutUrl;
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    return (
        <Modal closeModal={props.closeDepositModal}>
            <Modal.Deposit
                amount={amount}
                handleAmountChange={handleAmountChange}
                handleDeposit={handleDeposit}
                checkoutUrl={checkoutUrl}
            />
        </Modal>
    );
}

DepositModal.propTypes = {
    closeDepositModal: PropTypes.func.isRequired,
};

export default DepositModal;
