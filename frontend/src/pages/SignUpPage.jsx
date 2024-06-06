import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthenTitle, Form, GoogleButton, ConfirmButton } from "@features";
import axios from "axios";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const signup = (req, res) => {
    axios({
      method: "post",
      data: {
        name: name,
        email: email,
        password: password
      },
      withCredentials: true,
      url: "http://localhost:5000/signup"
    }).then(res => console.log(res)).catch(err => console.log(err));
    nav("/signin");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-auth-pattern bg-cover">
      <div className="w-[470px] rounded-2xl border-[2px] divide-solid border-[#5882C1] px-10 py-7  bg-[#5882C1]/[0.3]">
        <AuthenTitle title="Sign up" />
        <p className="text-[17px] leading-[20px] text-[#a6a6a6] font-kodchasan cursor-default select-none">
          To upload music and products, you must accept our
          <a href="#" className="text-[#8774f9] font-normal px-1">terms</a> and
          <a href="#" className="text-[#8774f9] font-normal px-1">conditions</a>
          <span className="text-[#7b7b7b]"> on the registration</span> website
        </p>
        <Form
          type="text"
          placeholder="Full name"
          action={e => setName(e.target.value)}
        />
        <Form
          type="email"
          placeholder="Email"
          action={e => setEmail(e.target.value)}
        />
        <Form
          type="password"
          placeholder="Password"
          haveIcon={true}
          action={e => setPassword(e.target.value)}
        />

        <div className="flex mt-6 space-x-2 select-none">
          <GoogleButton />
          <ConfirmButton
            title="Sign up"
            action={signup}
          />
        </div>

        <div className="mt-4 text-[#a6a6a6] text-[15px] select-none">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="font-kodchasan mr-3 w-[16px] h-[16px] border border-[#ccc] rounded-[2px] bg-white checked:bg-[#383838] cursor-pointer"
            />
            I read and accepted the
            <a href="#" className="text-[#8774f9] font-normal px-[4px]">terms</a> and
            <a href="#" className="text-[#8774f9] font-normal px-[4px]">conditions</a>
          </label>
        </div>

        <div className="mt-4 text-center text-[#a6a6a6] text-[15px] font-kodchasan cursor-default select-none">
          Already a member?
          <Link to="/signin" className="font-semibold text-[#fcfcfc] px-1">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
