import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../shared/Layout";
import Home from "../home";
import Cart from "../cart";
import Products from "../products";
import ProductDetails from "../product-details";
import Feedback from "../feedback";
import Info from "../info";
import TrackingOrder from "../tracking-order";
import ExpiredSubscriptionCard from "../renew/ExpiredSubscriptionCard";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/menu/:restoSlug" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="tracking-order" element={<TrackingOrder />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="info" element={<Info />} />
      </Route>
      <Route path="*" element={<ExpiredSubscriptionCard />} />
    </Route>
  )
);
