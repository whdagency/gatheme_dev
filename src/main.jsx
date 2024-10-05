import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "@/lib/store.jsx";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "react-use-cart";
import AppProvider from "./providers/AppProvider.jsx";
import "./index.css";
import I18NextProvider from "./providers/I18NextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppProvider>
        <I18NextProvider>
          <CartProvider id="cart" key={"cart"}>
            <Provider store={store}>
              <App />
            </Provider>
          </CartProvider>
        </I18NextProvider>
      </AppProvider>
    </HelmetProvider>
  </React.StrictMode>
);
