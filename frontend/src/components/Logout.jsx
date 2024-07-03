import { useLogOutMutation } from '@services/api';
import { Loading } from '.';

function Logout() {
    const [logOut, { isLoading }] = useLogOutMutation();

    const handleAction = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error(error);
        }
    };
    return isLoading ? (
        <Loading />
    ) : (
        <button
            className="block h-full w-max content-center rounded-full uppercase transition-colors"
            onClick={handleAction}
        >
            Log out
        </button>
    );
}

export default Logout;
