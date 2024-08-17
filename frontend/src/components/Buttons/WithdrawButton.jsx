import PropTypes from 'prop-types';
import WalletIcon from '@assets/img/wallet-icon.svg';

function WithdrawButton(props) {
    return (
        <button
            className="group relative flex w-52 items-center justify-center rounded-full border py-3 disabled:cursor-not-allowed disabled:brightness-50"
            onClick={props.openWithdrawModal}
            disabled={props.disabled}
        >
            <img
                src={WalletIcon}
                alt="wallet icon"
                className="mr-3 inline-block h-6 w-6"
            />
            {'Withdraw'}
            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-disabled:opacity-0"></div>
        </button>
    );
}

WithdrawButton.propTypes = {
    openWithdrawModal: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default WithdrawButton;
