import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function DefaultLayout() {
    return (
        <>
            <Header />
            <Sidebar />
            <main className="px-20 mt-[75px] ml-[175px]">
                <Outlet />
            </main>
        </>
    );
}