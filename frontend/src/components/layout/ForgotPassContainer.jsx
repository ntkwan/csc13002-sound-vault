import { Link } from "react-router-dom";

function ForgotPassContainer() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[370px] bg-transparent">
                <h1 className="text-center text-[55px] text-[#fcfcfc] font-italianno font-light my-1 cursor-default leading-none">
                    Forgot password
                </h1>
                <p className="text-[17px] leading-[20px] text-[#a6a6a6] font-kodchasan cursor-default">
                    Enter your email address below and we'll email you a link to reset your password.
                </p>
                <div className="relative mt-4">
                    <input
                        type="text"
                        placeholder="Email"
                        required
                        className="font-poppins text-[13.6px] w-full h-[50px] bg-[#383838] border-none outline-none rounded-[12px] p-4 pr-12 text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md"
                    />
                </div>
                <div className="flex mt-6 space-x-2">
                    <a className="flex items-center justify-center w-[110px] h-[49px] border-2 border-[#fcfcfc] rounded-[15px] hover:bg-[#2d2c30] hover:border-[#2d2c30] cursor-pointer">
                        <i className="bx bxl-google text-[#fcfcfc] text-3xl"></i>
                    </a>
                    <a className="flex-1 flex items-center justify-center h-[49px] bg-[#383838] rounded-[12px] text-[#fcfcfc] shadow-md hover:opacity-75 cursor-pointer">
                        {/* <span className="font-kodchasan text-[13.5px]">Send email</span> */}
                        <Link to="/reset-password" className="font-kodchasan text-[13.5px]">
                            Forgot your password?
                        </Link>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassContainer;