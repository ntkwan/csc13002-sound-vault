import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AuthenTitle,
  FormInput,
  GoogleButton,
  ConfirmButton,
} from "@features/authentication";
import axios from "axios";

function ForgotPassPage() {
  const [email, setEmail] = useState("");

  const nav = useNavigate();
  const forgotpsw = () => {
    axios({
      method: "post",
      data: {
        email: email,
      },
      withCredentials: true,
      url: "http://localhost:5000/forgot-password",
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
      <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
        <AuthenTitle title="Forgot password" />
        <p className="cursor-default select-none font-kodchasan text-[17px] leading-[20px] text-[#a6a6a6]">
          Enter your email address below and we send you a link to
          reset your password.
        </p>
        <FormInput
          type="email"
          placeholder="Email"
          action={(e) => setEmail(e.target.value)}
        />
        <div className="mt-6 flex select-none space-x-2">
          <a className="flex h-[49px] flex-1 cursor-pointer items-center justify-center rounded-[12px] bg-[#383838] text-[#fcfcfc] shadow-md hover:opacity-75">
            <ConfirmButton title="Send email" action={forgotpsw} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassPage;
