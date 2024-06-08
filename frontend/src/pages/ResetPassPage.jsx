import {
  AuthenTitle,
  FormInput,
  GoogleButton,
  ConfirmButton,
} from "@features/authentication";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function ResetPassPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [new_password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const resetpsw = () => {
    axios({
      method: "post",
      data: {
        attempt_password: new_password,
        confirm_password: confirm_password,
      },
      withCredentials: true,
      url: `http://localhost:5000/reset-password/${email}/${token}`,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
      <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
        <AuthenTitle title="Reset your password" />
        <p className="cursor-default select-none font-kodchasan text-[17px] leading-[20px] text-[#a6a6a6]">
          Enter your new password carefully. The new password must be 8
          characters long.
        </p>
        <FormInput
          type="password"
          placeholder="New password"
          haveIcon={true}
          action={(e) => setPassword(e.target.value)}
        />
        <FormInput
          type="password"
          placeholder="Repeat the password"
          haveIcon={true}
          action={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="mt-6 flex select-none space-x-2">
          <ConfirmButton title="Change password" action={resetpsw} />
        </div>
      </div>
    </div>
  );
}

export default ResetPassPage;
