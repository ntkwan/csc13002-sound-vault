import PropTypes from 'prop-types';
import Modal from './Modal';
import { useWithdrawMutation } from '@services/api';
import { toast } from 'react-toastify';

function WithdrawModal(props) {
    const [withdraw] = useWithdrawMutation();
    const handleWithdraw = async () => {
        try {
            const res = await withdraw().unwrap();
            toast.success(res.message);
            props.closeWithdrawModal();
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    return (
        <Modal closeModal={props.closeWithdrawModal}>
            <Modal.Withdraw handleWithdraw={handleWithdraw} />
        </Modal>
    );
}

WithdrawModal.propTypes = {
    bankInfo: PropTypes.object,
    closeWithdrawModal: PropTypes.func.isRequired,
};

export default WithdrawModal;
