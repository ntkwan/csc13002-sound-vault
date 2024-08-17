import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
    DepositButton,
    DepositModal,
    PageTitle,
    WithdrawButton,
    WithdrawModal,
} from '@components';
import historyIcon from '@assets/img/history-icon.svg';
import { selectCurrentProfile } from '@services/selectors';
import { toast } from 'react-toastify';

function WalletPage() {
    const { balance, isVerified, bankInfo } = useSelector(selectCurrentProfile);
    const formattedBalance = balance.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => {
        if (isVerified && balance !== 0) {
            setModalVisible(true);
            return;
        }
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
    };

    const location = useLocation();
    const nav = useNavigate();
    useEffect(() => {
        if (location.search !== '') {
            const queryparams = new URLSearchParams(location.search);
            const status = queryparams.get('status');
            const id = queryparams.get('id');
            if (!id || !status) {
                return;
            }

            if (status === 'PAID') {
                toast.success('Deposit SUCCESSFULLY!');
            } else if (status === 'CANCELLED') {
                toast.error('Deposit CANCELLED!');
            }
            nav('/wallet');
        }
    }, [location.search, nav]);

    return (
        <div className="wallet">
            <PageTitle title="Wallet" className="py-8" />

            <div className="waller__content flex h-80 items-center justify-center space-x-[10%]">
                {/* wallet card */}
                <div className="wallet-card__container relative h-56 w-96 overflow-clip rounded-[38px] bg-wallet-pattern pl-6 pr-4 pt-6">
                    <div className="wallet-card__bg-elip rounded-100% absolute bottom-[55%] left-1/2 h-56 w-96 rounded-[100%] bg-black bg-opacity-10"></div>
                    <div className="wallet-card__bg-elip rounded-100% absolute right-1/2 top-[55%] h-56 w-96 rounded-[100%] bg-black bg-opacity-10"></div>
                    <h2 className="wallet-card__title text-xl opacity-55">
                        Current Balance
                    </h2>
                    <p className="wallet-card__balance mt-3 text-4xl">
                        {formattedBalance}
                    </p>
                    <p className="waller-card__logo absolute bottom-2 right-5 content-end text-xl font-bold opacity-35">
                        SoundVault
                    </p>
                </div>

                {/* devider */}
                <div className="devider h-full w-px bg-white opacity-50"> </div>

                {/* action container */}
                <div className="wallet__action-container flex h-full flex-col justify-around">
                    {isVerified ? (
                        <WithdrawButton
                            openWithdrawModal={openModal}
                            disabled={balance === 0}
                        />
                    ) : (
                        <DepositButton openDepositModal={openModal} />
                    )}
                    <Link
                        to={`${isVerified ? 'artist/history' : 'history'}`}
                        className="wallet__action group relative flex w-52 items-center justify-center rounded-full border py-3"
                    >
                        <img
                            src={historyIcon}
                            alt="history-icon"
                            className="mr-3 inline-block h-6 w-6"
                        />
                        History
                        <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></div>
                    </Link>
                </div>
            </div>
            {modalVisible &&
                (isVerified ? (
                    <WithdrawModal
                        bankInfo={bankInfo}
                        closeWithdrawModal={closeModal}
                    />
                ) : (
                    <DepositModal closeDepositModal={closeModal} />
                ))}
        </div>
    );
}

export default WalletPage;
