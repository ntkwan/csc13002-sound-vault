import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "@components";

function DefaultLayout() {
  return (
    <>
      Default Layout
      <Header />
      <Sidebar />
      <main className="relative px-10 mt-[70px] ml-[175px] ">
        <Outlet />
      </main>
    </>
  );
}

export default DefaultLayout;
