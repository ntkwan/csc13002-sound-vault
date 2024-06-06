import { Link } from "react-router-dom";
import { AuthenTitle, Form, GoogleButton, ConfirmButton } from "@features";

function SignInPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-auth-pattern bg-cover">
      <div className="w-[470px] rounded-2xl border-[2px] divide-solid border-[#5882C1] px-10 py-7 bg-[#5882C1]/[0.3]">
        <AuthenTitle title="Sign in" />
        <Form type="text" placeholder="Full name" />
        <Form type="password" placeholder="Password" haveIcon={true} />
        <Link to="/forgotpass" className="text-[#8774f9] text-[12px] font-medium select-none">
          Forgot your password?
        </Link>
        <div className="flex mt-6 space-x-2 select-none">
          <GoogleButton />
          <ConfirmButton title="Sign in" />
        </div>
        <div className="mt-4 text-center text-[#a6a6a6] text-[15px] font-kodchasan select-none">
          Not a member?
          <Link to="/signup" className="font-semibold text-[#fcfcfc] px-1">Sign up</Link> now
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
