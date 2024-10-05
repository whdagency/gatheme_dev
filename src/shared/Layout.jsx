import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import AnimatedLayout from "./AnimateLayout";

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { restoSlug, customization, selectedLanguage } = useMenu();
  const isIndexPage = pathname === `/menu/${restoSlug}`;
  const showNav =
    pathname === `/menu/${restoSlug}` ||
    pathname === `/menu/${restoSlug}/info` ||
    pathname === `/menu/${restoSlug}/cart` ||
    pathname === `/menu/${restoSlug}/feedback` ||
    pathname === `/menu/${restoSlug}/products`;

  useEffect(() => {
    document.body.style.backgroundColor = customization?.selectedBgColor;
  }, [customization?.selectedBgColor]);

  useEffect(() => {
    selectedLanguage === "ar"
      ? (document.body.dir = "rtl")
      : (document.body.dir = "ltr");

    return () => {
      document.body.dir = "ltr";
    };
  }, [selectedLanguage]);

  return (
    <section
      className="flex flex-col -mt-3 max-w-md min-h-screen mx-auto shadow rounded-[20px_20px_40px_40px] relative overflow-x-hidden"
      style={{
        background: customization?.selectedBgColor,
      }}
    >
      <AnimatedLayout>
        <Outlet />
      </AnimatedLayout>

      {showNav && <Navbar hideCallToActionBtn={!isIndexPage} />}
      <Toaster position="top-center" richColors />
    </section>
  );
};

export default Layout;
