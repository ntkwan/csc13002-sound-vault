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
      { path: "resetpass", Component: ResetPassPage },
      { path: "forgotpass", Component: ForgotPassPage },
    ],
  },
]);

export default router;
