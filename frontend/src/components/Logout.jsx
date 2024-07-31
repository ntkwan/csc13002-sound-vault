import { NavLink } from 'react-router-dom';
import { useLogOutMutation } from '@services/api';
import { LogoutIcon } from '.';
import { toast } from 'react-toastify';
import { persistor } from '@store/index';

function Logout() {
    const [logOut] = useLogOutMutation();
    const handleAction = async () => {
        try {
            const res = await logOut().unwrap();
            persistor.purge();
            console.log(res);
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <NavLink
            onClick={handleAction}
            className="relative my-1 flex items-center rounded-full px-3 py-3 leading-none transition-colors duration-400 ease-in-out hover:bg-white hover:bg-opacity-20"
        >
            {LogoutIcon()}
            <span className="pl-3">LOGOUT</span>
        </NavLink>
    );
}

export default Logout;
