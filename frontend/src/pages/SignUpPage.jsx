import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthenTitle, FormInput, GoogleButton, ConfirmButton } from "@features";
import axios from "axios";

const inputs = [
  {
    name: "name",
    type: "text",
    placeholder: "User name",
    required: true,
    error: "User name should be at 3-16 characters!",
    pattern: "^.{3,16}$",
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    required: true,
    error: "Invalid email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    required: true,
    error:
      "Password should be at least 6 characters and contain 1 letter, 1 number and 1 special character!",
    pattern: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{6,}$",
  },
];

function SignUpPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [checked, setChecked] = useState(false);
  const nav = useNavigate();

  const signup = () => {
    axios({
      method: "post",
      data: {
        name: values["name"],
        email: values["email"],
        password: values["password"],
      },
      withCredentials: true,
      url: "http://localhost:5000/signup",
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !values["name"] ||
      !values["email"] ||
      !values["password"] ||
      !checked ||
      !values["name"].match(inputs[0].pattern) ||
      !values["email"].match(inputs[1].pattern) ||
      !values["password"].match(inputs[2].pattern)
    ) {
      return;
    }
    signup();
    nav("/signin");
  };

  const handleAction = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
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
