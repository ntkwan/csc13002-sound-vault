import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "@components";

function DefaultLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="relative px-20 mt-[70px] mb-[70px] ml-[175px]">
        <Outlet />
      </main>
    </>
  );
}

export default DefaultLayout;
