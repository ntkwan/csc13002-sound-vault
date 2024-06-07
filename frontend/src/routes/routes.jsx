import { createBrowserRouter } from "react-router-dom";

import { DefaultLayout, AuthenticationLayout } from "@layouts";
import { HomePage, ProfilePage, ArtistPage, SignInPage, SignUpPage, ResetPassPage, ForgotPassPage } from "@pages";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      { path: "", Component: HomePage },
      { path: "profile", Component: ProfilePage },
      { path: "artist", Component: ArtistPage },
    ],
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
