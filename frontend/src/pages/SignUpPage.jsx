import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignUpMutation } from "@services/api";
import {
  AuthenTitle,
  FormInput,
  GoogleButton,
  ConfirmButton,
} from "@features/authentication/components";
import { InformationCircle, INPUTS, Loading } from "@components";

function SignUpPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const [signUp, { isLoading }] = useSignUpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !values["name"] ||
      !values["email"] ||
      !values["password"] ||
      !checked ||
      !values["name"].match(INPUTS.SIGN_UP[0].pattern) ||
      !values["password"].match(INPUTS.SIGN_UP[2].pattern)
    ) {
      return;
    }
    try {
      const res = await signUp(values).unwrap();
      console.log(res.message);
      setValues({ name: "", email: "", password: "" });
      nav("/signin");
    } catch (error) {
      const errMsg = error.data.message;
      console.error(errMsg);
      setError(errMsg);
    }
  };

  const handleAction = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
      <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
        <AuthenTitle title="Sign up" />
        <p className="cursor-default select-none font-kodchasan text-[17px] leading-[20px] text-[#a6a6a6]">
          To upload music and products, you must accept our
          <a href="#" className="px-1 font-normal text-[#8774f9]">
            terms
          </a>{" "}
          and
          <a href="#" className="px-1 font-normal text-[#8774f9]">
            conditions
          </a>
          <span className="text-[#7b7b7b]"> on the registration</span> website
        </p>
        {error && (
          <div className="mt-3 flex place-content-center gap-1 rounded-xl bg-red-500 py-1 font-bold">
            <InformationCircle />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {INPUTS.SIGN_UP.map((input) => (
            <FormInput
              key={input.name}
              {...input}
              haveIcon={input.type === "password"}
              value={values[input.name]}
              action={handleAction}
            />
          ))}
          <div className="mt-6 flex select-none space-x-2">
            <GoogleButton />
            <ConfirmButton
              title="Sign up"
              disabled={
                !values["name"] ||
                !values["email"] ||
                !values["password"] ||
                !checked
                  ? true
                  : false
              }
            />
          </div>
        </form>

        <div className="mt-4 select-none text-[15px] text-[#a6a6a6]">
          <label className="flex items-center">
            <input
              type="checkbox"
              value={checked}
              onClick={() => setChecked(!checked)}
              className="mr-3 h-[16px] w-[16px] cursor-pointer rounded-[2px] border border-[#ccc] bg-white font-kodchasan checked:bg-[#383838]"
            />
            I read and accepted the
            <a href="#" className="px-[4px] font-normal text-[#8774f9]">
              terms
            </a>{" "}
            and
            <a href="#" className="px-[4px] font-normal text-[#8774f9]">
              conditions
            </a>
          </label>
        </div>

        <div className="mt-4 cursor-default select-none text-center font-kodchasan text-[15px] text-[#a6a6a6]">
          Already a member?
          <Link to="/signin" className="px-1 font-semibold text-[#fcfcfc]">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
