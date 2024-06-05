import { Outlet } from "react-router-dom";

function AuthenticationLayout() {
  return (
    <>
      Authentication Layout
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AuthenticationLayout;
