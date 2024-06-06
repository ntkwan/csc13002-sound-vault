import { AuthenTitle, Form, GoogleButton, ConfirmButton } from "@features";

function ResetPassPage() {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-auth-pattern bg-cover">
            <div className="w-[470px] rounded-2xl border-[2px] divide-solid border-[#5882C1] px-10 py-7  bg-[#5882C1]/[0.3]">
                <AuthenTitle title="Reset your password" />
                <p className="text-[17px] leading-[20px] text-[#a6a6a6] font-kodchasan cursor-default select-none">
                    Enter your new password carefully. The new password must be 8 characters long.
                </p>
                <Form type="password" placeholder="New password" haveIcon={true} />
                <Form type="password" placeholder="Repeat the password" haveIcon={true} />
                <div className="flex mt-6 space-x-2 select-none">
                    <GoogleButton />
                    <ConfirmButton title="Sign up" />
                </div>
            </div>
        </div>
    );
}

export default ResetPassPage;