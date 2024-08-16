import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDonateMutation } from '@services/api';

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
        <div
            className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-black bg-opacity-40"
            onClick={props.closeDonateModal}
        >
            <div
                className="absolute left-1/3 top-1/4 z-50 flex h-1/3 min-h-80 w-1/3 min-w-max flex-col items-center justify-evenly rounded-3xl align-middle text-2xl shadow-2xl outline backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <i
                    className="bx bx-x absolute right-4 top-3 cursor-pointer transition-all duration-100 ease-in hover:scale-125"
                    onClick={props.closeDonateModal}
                ></i>
                <span>Available balance:</span>
                <span
                    className={`font-bold ${balance === 0 ? 'text-red-500' : 'text-purple-500'}`}
                >
                    {balance.toLocaleString('vn-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </span>
                {balance !== 0 ? (
                    <>
                        <span className="p-4">
                            Amount donation for <i>{props.song}</i> by{' '}
                            <i>{props.artist}</i>
                        </span>
                        <input
                            type="text"
                            value={amount.toLocaleString()}
                            onChange={handleAmountChange}
                            className="w-1/2 border-b bg-transparent text-center outline-none"
                        ></input>
                        <input
                            type="range"
                            value={amount}
                            min={0}
                            step={1}
                            max={balance}
                            onChange={handleAmountChange}
                            className="w-4/5"
                        />
                        <button
                            className="group relative min-w-40 rounded-full outline outline-2 transition duration-300 ease-in-out"
                            disabled={balance === 0}
                            onClick={handleDonate}
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
                        <button className="group relative min-w-40 rounded-full outline outline-2 transition duration-300 ease-in-out">
                            Top up
                            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

DonateModal.propTypes = {
    balance: PropTypes.number.isRequired,
    closeDonateModal: PropTypes.func.isRequired,
    song: PropTypes.string,
    artist: PropTypes.string,
};

export default DonateModal;
