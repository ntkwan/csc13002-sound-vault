import { Link } from "react-router-dom";
import hide from "../../assets/img/hide.svg";

function LogInContainer() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[370px] bg-transparent">
                <h1 className="text-center text-[55px] text-[#fcfcfc] font-italianno font-light my-0 cursor-default leading-none">
                    Sign in
                </h1>
                <div className="relative mt-4">
                    <input type="text" placeholder="Full Name" required
                        className="font-poppins text-[13.6px] w-full h-[50px] bg-[#383838] border-none outline-none rounded-[12px] p-4 pr-12 text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md" />
                </div>
                <div className="relative mt-4">
                    <input type="password" placeholder="Password" required
                        className="font-poppins text-[13.6px] w-full h-[50px] bg-[#383838] border-none outline-none rounded-[12px] p-4 pr-12 text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md" />
                    <img src={hide} alt=""
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl scale-75" />
                </div>
                {/* <a href="#" className="text-[#8774f9] text-[12px] font-medium">
                    Forgot your password?
                </a> */}
                <Link to="/forgot-password" className="text-[#8774f9] text-[12px] font-medium">
                    Forgot your password?
                </Link>
                <div className="flex mt-6 space-x-2">
                    <a
                        className="flex items-center justify-center w-[110px] h-[49px] border-2 border-[#fcfcfc] rounded-[15px] hover:bg-[#2d2c30] hover:border-[#2d2c30] cursor-pointer">
                        <i className='bx bxl-google text-[#fcfcfc] text-3xl'></i>
                    </a>
                    <a
                        className="flex-1 flex items-center justify-center h-[49px] bg-[#383838] rounded-[12px] text-[#fcfcfc] shadow-md hover:opacity-75 cursor-pointer">
                        <span className="font-kodchasan text-[13.5px]">Sign up</span>
                    </a>
                </div>
                <div className="mt-4 text-center text-[#a6a6a6] text-[15px] font-kodchasan">
                    Not a member?
                    {/* <a href="#" className="font-semibold text-[#fcfcfc]">Sign up</a> now */}
                    <Link to="/signup" className="font-semibold text-[#fcfcfc] px-1">Sign up</Link> now
                </div>
            </div>
        </div>
    );
}

export default LogInContainer;