import React from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const Layout = () => {
  const pathname = useLocation().pathname;
  const { restoSlug } = useMenu();
  const isIndexPage = pathname === `/menu/${restoSlug}`;
  const showNav =
    pathname === `/menu/${restoSlug}` ||
    pathname === `/menu/${restoSlug}/info` ||
    pathname === `/menu/${restoSlug}/cart` ||
    pathname === `/menu/${restoSlug}/feedback`;

  return (
    <section className="flex flex-col -mt-3 max-w-md min-h-screen mx-auto shadow rounded-[20px_20px_40px_40px] relative overflow-x-hidden">
      <Outlet />
      {showNav && <Navbar hideCallToActionBtn={!isIndexPage} />}
    </section>
  );
};

export default Layout;
