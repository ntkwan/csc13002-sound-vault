import { createBrowserRouter } from "react-router-dom";
import ChartPage from "../pages/ChartPage";
import HomePage from "../pages/HomePage";
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
]);

export default router;
