import { NavLink } from 'react-router-dom';
import { useLogOutMutation } from '@services/api';
import { LogoutIcon } from '.';
import { toast } from 'react-toastify';
import { persistor } from '@store/index';

function Logout() {
    const [logOut] = useLogOutMutation();
    const handleAction = async () => {
        try {
            await logOut().unwrap();
            persistor.purge();
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <NavLink
            onClick={handleAction}
            className="relative my-1 flex items-center rounded-full px-3 py-3 leading-none transition-colors duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
        >
            {LogoutIcon()}
            <span className="pl-3">LOG OUT</span>
        </NavLink>
    );
}

export default Logout;
