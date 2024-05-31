import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ChartPage from "@pages/ChartPage";
import HomePage from "@pages/HomePage";
// import ProfilePage from "@pages/ProfilePage";
import { DefaultLayout } from "@components/layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<DefaultLayout />}>
      <Route path="" element={<HomePage />} />
      {/* <Route path="profile" element={<ProfilePage />} /> */}
      <Route path="chart" element={<ChartPage />} />
      <Route path="artist" />
    </Route>,
  ),
);

export default router;
