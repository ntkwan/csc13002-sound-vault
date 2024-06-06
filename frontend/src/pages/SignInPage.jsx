import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthenTitle, Form, GoogleButton, ConfirmButton } from "@features";
import axios from "axios";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const signin = (req, res) => {
    axios({
      method: "post",
      data: {
        email: email,
        password: password
      },
      withCredentials: true,
      url: "http://localhost:5000/signin"
    }).then(res => console.log(res)).catch(err => console.log(err));
    nav("/home");
  };


  return (
    <div className="w-screen h-screen flex justify-center items-center bg-auth-pattern bg-cover">
      <div className="w-[470px] rounded-2xl border-[2px] divide-solid border-[#5882C1] px-10 py-7 bg-[#5882C1]/[0.3]">
        <AuthenTitle title="Sign in" />
        <Form
          type="text"
          placeholder="Email"
          action={e => setEmail(e.target.value)}
        />
        <Form
          type="password"
          placeholder="Password"
          haveIcon={true}
          action={e => setPassword(e.target.value)}
        />
        <Link to="/forgotpass" className="text-[#8774f9] text-[12px] font-medium select-none">
          Forgot your password?
        </Link>
        <div className="flex mt-6 space-x-2 select-none">
          <GoogleButton />
          <ConfirmButton
            title="Sign in"
            action={signin}
          />
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
