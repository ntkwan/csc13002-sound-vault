import { PageTitle } from '@components/index';
import topUpIcon from '@assets/img/top-up-icon.svg';
import historyIcon from '@assets/img/history-icon.svg';
import walletIcon from '@assets/img/wallet-icon.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentProfile } from '@services/selectors';

function WalletPage() {
    const balance = 10000;
    const formattedBalance = balance.toLocaleString('de-DE');
    const { isAdmin } = useSelector(selectCurrentProfile);
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
                    <Link className="wallet__action py-x group relative flex w-52 items-center justify-center rounded-full border py-3">
                        <img
                            src={isAdmin ? walletIcon : topUpIcon}
                            alt="top-up-icon"
                            className="mr-3 inline-block h-6 w-6"
                        />
                        {isAdmin ? 'Withdraw' : 'Top Up'}
                        <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></div>
                    </Link>

                    <Link
                        to="history"
                        className="wallet__action py-x group relative flex w-52 items-center justify-center rounded-full border py-3"
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
        </div>
    );
}

export default WalletPage;
