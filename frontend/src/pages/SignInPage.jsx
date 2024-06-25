import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "@features/authentication/slices";
import { useSignInMutation } from "@services/api";
import {
  AuthenTitle,
  FormInput,
  GoogleButton,
  ConfirmButton,
} from "@features/authentication/components";
import { InformationCircle } from "@components";

const inputs = [
  {
    name: "email",
    type: "text",
    placeholder: "Email",
    required: true,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    required: true,
  },
];

function SignInPage() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [signIn, { isLoading }] = useSignInMutation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleAction = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values["email"] || !values["password"]) {
      return;
    }
    try {
      const res = await signIn(values).unwrap();
      const user = values["email"];
      const token = res.token;
      dispatch(logIn({ user, token }));
      setValues({ email: "", password: "" });
      nav("/");
    } catch (error) {
      const errMsg = error.data.message;
      setError(errMsg);
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
      <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
        <AuthenTitle title="Sign in" />
        {error && (
          <div className="mt-3 flex place-content-center gap-1 rounded-xl bg-red-500 py-1 font-bold">
            <InformationCircle />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {inputs.map((input) => (
            <FormInput
              key={input.name}
              {...input}
              haveIcon={input.type === "password"}
              value={values[input.name]}
              action={handleAction}
            />
          ))}
          <Link
            to="/forgot-password"
            className="select-none text-[12px] font-medium text-[#8774f9]"
          >
            Forgot your password?
          </Link>
          <div className="mt-6 flex select-none space-x-2">
            <GoogleButton />
            <ConfirmButton
              title="Sign in"
              disabled={!values["email"] || !values["password"] ? true : false}
            />
          </div>
        </form>
        <div className="mt-4 select-none text-center font-kodchasan text-[15px] text-[#a6a6a6]">
          Not a member?
          <Link to="/signup" className="px-1 font-semibold text-[#fcfcfc]">
            Sign up
          </Link>
          now
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
