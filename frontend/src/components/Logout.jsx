import { useLogOutMutation } from "@services/api";
import { Loading } from ".";

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
      className="block h-full w-max content-center rounded-full px-[9px] uppercase transition-colors duration-400 ease-in-out hover:cursor-pointer hover:bg-white hover:bg-opacity-25"
      onClick={handleAction}
    >
      Log out
    </button>
  );
}

export default Logout;
