import { Outlet } from "react-router-dom";

function AuthenticationLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AuthenticationLayout;
