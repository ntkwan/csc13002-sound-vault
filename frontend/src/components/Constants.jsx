export const INPUTS = {
  SIGN_IN: [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      required: true,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      required: true,
    },
  ],
  SIGN_UP: [
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
  ],
  RESET_PASS: [
    {
      name: "new_password",
      type: "password",
      placeholder: "New password",
      required: true,
      error:
        "Password should be at least 6 characters and contain 1 letter, 1 number and 1 special character!",
      pattern: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{6,}$",
    },
    {
      name: "confirm_password",
      type: "password",
      placeholder: "Repeat the password",
      required: true,
    },
  ],
};
