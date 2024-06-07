import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AuthenTitle,
  FormInput,
  GoogleButton,
  ConfirmButton,
} from "@features/authentication";
import axios from "axios";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const signin = () => {
    axios({
      method: "post",
      data: {
        email: email,
        password: password,
      },
      withCredentials: true,
      url: "http://localhost:5000/signin",
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    nav("/home");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
      <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
        <AuthenTitle title="Sign in" />
        <FormInput
          type="text"
          placeholder="Email"
          action={(e) => setEmail(e.target.value)}
        />
        <FormInput
          type="password"
          placeholder="Password"
          haveIcon={true}
          action={(e) => setPassword(e.target.value)}
        />
        <Link
          to="/forgot-password"
          className="select-none text-[12px] font-medium text-[#8774f9]"
        >
          Forgot your password?
        </Link>
        <div className="mt-6 flex select-none space-x-2">
          <GoogleButton />
          <ConfirmButton title="Sign in" action={signin} />
        </div>
        <div className="mt-4 select-none text-center font-kodchasan text-[15px] text-[#a6a6a6]">
          Not a member?
          <Link to="/signup" className="px-1 font-semibold text-[#fcfcfc]">
            Sign up
          </Link>{" "}
          now
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
