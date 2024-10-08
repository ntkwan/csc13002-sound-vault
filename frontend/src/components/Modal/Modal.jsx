import PropTypes from 'prop-types';

function Modal({ children, ...props }) {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-black bg-opacity-40"
            onClick={props.closeModal}
        >
            <div
                className="absolute left-1/3 top-1/4 z-50 flex h-fit min-h-[33.33%] w-1/3 min-w-max flex-col items-center justify-evenly rounded-3xl align-middle text-2xl shadow-2xl outline backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <i
                    className="bx bx-x absolute right-4 top-3 cursor-pointer transition-all duration-100 ease-in hover:scale-125"
                    onClick={props.closeModal}
                ></i>
                {children}
            </div>
        </div>
    );
}

Modal.Donate = (props) => {
    return (
        <>
            <span>Available balance:</span>
            <span
                className={`font-bold ${props.balance === 0 ? 'text-red-500' : 'text-purple-500'}`}
            >
                {props.balance.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}
            </span>
            {props.balance !== 0 ? (
                <>
                    <span className="p-4">
                        Amount donation for <i>{props.song}</i> by{' '}
                        <i>{props.artist}</i>
                    </span>
                    <input
                        type="text"
                        className="w-1/2 border-b bg-transparent text-center outline-none"
                        value={props.amount.toLocaleString()}
                        onChange={props.handleAmountChange}
                    />
                    <input
                        type="range"
                        value={props.amount}
                        min={0}
                        step={1}
                        max={props.balance}
                        onChange={props.handleAmountChange}
                        className="w-4/5"
                    />
                    <button
                        className="group relative min-w-40 rounded-full px-6 py-1 outline outline-2 transition duration-300 ease-in-out"
                        disabled={props.balance === 0}
                        onClick={props.handleDonate}
                    >
                        Donate
                        <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
                    </button>
                </>
            ) : (
                <>
                    <span className="font-bold text-red-500">
                        You have zero balance !!!
                    </span>
                    <span>Top up now to donate</span>
                    <button
                        className="group relative min-w-40 rounded-full px-6 py-1 outline outline-2 transition duration-300 ease-in-out"
                        onClick={props.openDepositModal}
                    >
                        Top up
                        <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
                    </button>
                </>
            )}
        </>
    );
};

Modal.Deposit = (props) => {
    return (
        <>
            <span>Choose amount to deposit</span>
            <select
                name="amount"
                className="appearance-none rounded-lg bg-white px-3 py-1 text-center text-black outline-none focus:outline-none"
                value={props.amount}
                onChange={props.handleAmountChange}
            >
                {[10000, 20000, 50000, 100000, 200000, 500000, 1000000].map(
                    (amount) => (
                        <option key={amount} value={amount}>
                            {amount.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </option>
                    ),
                )}
            </select>
            <button
                className="group relative min-w-40 rounded-full px-6 py-1 outline outline-2 transition duration-300 ease-in-out"
                onClick={props.handleDeposit}
            >
                Deposit
                <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
            </button>
            {props.checkoutUrl !== '' && (
                <span>
                    Click
                    <a
                        href={props.checkoutUrl}
                        rel="noreferrer"
                        className="text-[#BD00FF]"
                    >
                        here
                    </a>
                    if you are not redirected.
                </span>
            )}{' '}
        </>
    );
};

Modal.Withdraw = (props) => {
    return (
        <>
            <span className="font-bold text-red-500">
                All your balance will be withdrawn!!!
            </span>
            <span>Are you sure?</span>
            <button
                className="group relative min-w-40 rounded-full px-6 py-1 outline outline-2 transition duration-300 ease-in-out"
                onClick={props.handleWithdraw}
            >
                Withdraw
                <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
            </button>
            <span className="px-4 text-xl">
                Your request will be processed within 1 to 3 business days
            </span>
        </>
    );
};

Modal.QrCode = (props) => {
    return (
        <>
            <img src={props.qrCode} alt="qr code" className="m-4 w-1/3" />
            <span>
                Scan this{' '}
                <a href={props.qrCode} className="text-blue-500">
                    <i>QR Code</i>
                </a>{' '}
                to deposit money
            </span>
            <button
                className="group relative my-4 min-w-40 rounded-full px-6 py-1 outline outline-2 transition duration-300 ease-in-out"
                onClick={props.handleWithdraw}
            >
                Withdraw Processed
                <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
            </button>
            <button
                onClick={props.handleCancelWithdraw}
                className="mb-2 text-base text-red-500"
            >
                <i>Cancel Withdraw</i>
            </button>
        </>
    );
};

Modal.propTypes = {
    children: PropTypes.node,
    closeModal: PropTypes.func,
};

Modal.Donate.displayName = 'Donate';
Modal.Donate.propTypes = {
    balance: PropTypes.number,
    song: PropTypes.string,
    artist: PropTypes.string,
    amount: PropTypes.number,
    handleAmountChange: PropTypes.func,
    handleDonate: PropTypes.func,
    openDepositModal: PropTypes.func,
};

Modal.Deposit.displayName = 'Deposit';
Modal.Deposit.propTypes = {
    amount: PropTypes.number,
    handleAmountChange: PropTypes.func,
    handleDeposit: PropTypes.func,
    checkoutUrl: PropTypes.string,
};

Modal.Withdraw.displayName = 'Withdraw';
Modal.Withdraw.propTypes = {
    handleWithdraw: PropTypes.func,
};

Modal.QrCode.displayName = 'QrCode';
Modal.QrCode.propTypes = {
    qrCode: PropTypes.string,
    handleWithdraw: PropTypes.func,
    handleCancelWithdraw: PropTypes.func,
};

export default Modal;
