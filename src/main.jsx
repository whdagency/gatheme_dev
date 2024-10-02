import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "@/lib/store.jsx";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "react-use-cart";
import AppProvider from "./providers/AppProvider.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppProvider>
        <CartProvider id="cart" key={"cart"}>
          <Provider store={store}>
            <App />
          </Provider>
        </CartProvider>
      </AppProvider>
    </HelmetProvider>
  </React.StrictMode>
);
