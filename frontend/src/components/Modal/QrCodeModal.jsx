import PropTypes from 'prop-types';
import Modal from './Modal';
import { useCancelWithdrawMutation } from '@services/api';
import { toast } from 'react-toastify';

function QrCodeModal(props) {
    const [cancelWithdraw] = useCancelWithdrawMutation();

    const handleCancelWithdraw = async () => {
        try {
            const res = await cancelWithdraw(props.orderId).unwrap();
            toast.success(res.message);
            props.closeQrCodeModal();
        } catch (error) {
            toast.error(error.data.message);
        }
    };
    return (
        <Modal closeModal={props.closeQrCodeModal}>
            <Modal.QrCode
                qrCode={props.qrCode}
                handleCancelWithdraw={handleCancelWithdraw}
            />
        </Modal>
    );
}

QrCodeModal.propTypes = {
    qrCode: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    closeQrCodeModal: PropTypes.func.isRequired,
};

export default QrCodeModal;
