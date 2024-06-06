import { createBrowserRouter } from "react-router-dom";
import ChartPage from "../pages/ChartPage";
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SignUpPage";
import LogInPage from "../pages/LogInPage";
import ForgotPassPage from "../pages/ForgotPassPage";
import ResetPassPage from "../pages/ResetPassPage";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/chart",
    element: <ChartPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/signin",
    element: <LogInPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPassPage />,
  }
]);

export default router;
