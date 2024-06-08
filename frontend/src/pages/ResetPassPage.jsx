import {
  AuthenTitle,
  FormInput,
  GoogleButton,
  ConfirmButton,
} from "@features/authentication";

function ResetPassPage() {
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
        />
        <FormInput
          type="password"
          placeholder="Repeat the password"
          haveIcon={true}
        />
        <div className="mt-6 flex select-none space-x-2">
          <GoogleButton />
          <ConfirmButton title="Sign up" />
        </div>
      </div>
    </div>
  );
}

export default ResetPassPage;
