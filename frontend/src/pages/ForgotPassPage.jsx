import { Link } from "react-router-dom";
import {
  AuthenTitle,
  FormInput,
  GoogleButton,
  ConfirmButton,
} from "@features/authentication";

function ForgotPassPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
      <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
        <AuthenTitle title="Forgot password" />
        <p className="cursor-default select-none font-kodchasan text-[17px] leading-[20px] text-[#a6a6a6]">
          Enter your email address below and we`&aposll email you a link to
          reset your password.
        </p>
        <FormInput type="email" placeholder="Email" />
        <div className="mt-6 flex select-none space-x-2">
          <GoogleButton />
          <a className="flex h-[49px] flex-1 cursor-pointer items-center justify-center rounded-[12px] bg-[#383838] text-[#fcfcfc] shadow-md hover:opacity-75">
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
