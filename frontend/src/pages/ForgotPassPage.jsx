import { Link } from "react-router-dom";
import { AuthenTitle, Form, GoogleButton, ConfirmButton } from "@features";

function ForgotPassPage() {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-auth-pattern bg-cover">
            <div className="w-[470px] rounded-2xl border-[2px] divide-solid border-[#5882C1] px-10 py-7  bg-[#5882C1]/[0.3]">
                <AuthenTitle title="Forgot password" />
                <p className="text-[17px] leading-[20px] text-[#a6a6a6] font-kodchasan cursor-default select-none">
                    Enter your email address below and we`&aposll email you a link to reset your password.
                </p>
                <Form type="email" placeholder="Email" />
                <div className="flex mt-6 space-x-2 select-none">
                    <GoogleButton />
                    <a className="flex-1 flex items-center justify-center h-[49px] bg-[#383838] rounded-[12px] text-[#fcfcfc] shadow-md hover:opacity-75 cursor-pointer">
                        <Link to="/resetpass">
                            <ConfirmButton title="Send email" />
                        </Link>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassPage;