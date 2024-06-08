import { createBrowserRouter } from "react-router-dom";

import { DefaultLayout, AuthenticationLayout } from "@layouts";
import { HomePage, SignInPage, SignUpPage, ResetPassPage, ForgotPassPage } from "@pages";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [{ path: "", Component: HomePage }],
  },
  {
    Component: AuthenticationLayout,
    children: [
      { path: "signin", Component: SignInPage },
      { path: "signup", Component: SignUpPage },
      { path: "reset-password", Component: ResetPassPage },
      { path: "forgot-password", Component: ForgotPassPage },
    ],
  },
]);

export default router;
