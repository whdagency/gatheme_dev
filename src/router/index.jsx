import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../shared/Layout";
import Home from "../Home/Home";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/menu/:restoSlug" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Route>
  )
);
