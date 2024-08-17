import PropTypes from 'prop-types';
import topUpIcon from '@assets/img/top-up-icon.svg';

function DepositButton(props) {
    return (
        <button
            className="py-x group relative flex w-52 items-center justify-center rounded-full border py-3"
            onClick={props.openDepositModal}
        >
            <img
                src={topUpIcon}
                alt="top up icon"
                className="mr-3 inline-block h-6 w-6"
            />
            {'Top Up'}
            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></div>
        </button>
    );
}

DepositButton.propTypes = {
    openDepositModal: PropTypes.func.isRequired,
};

export default DepositButton;
