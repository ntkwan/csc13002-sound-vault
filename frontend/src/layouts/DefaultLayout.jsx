import { Outlet } from "react-router-dom";

function DefaultLayout() {
  return (
    <>
      Default Layout
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default DefaultLayout;
