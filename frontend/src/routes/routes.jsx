import { createBrowserRouter } from "react-router-dom";

import { DefaultLayout, AuthenticationLayout } from "@layouts";
import { HomePage, SignInPage, SignUpPage } from "@pages";

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
    ],
  },
]);

export default router;
