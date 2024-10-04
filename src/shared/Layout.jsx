import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedLayout from "./AnimateLayout";

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { restoSlug, customization } = useMenu();
  const isIndexPage = pathname === `/menu/${restoSlug}`;
  const showNav =
    pathname === `/menu/${restoSlug}` ||
    pathname === `/menu/${restoSlug}/info` ||
    pathname === `/menu/${restoSlug}/cart` ||
    pathname === `/menu/${restoSlug}/feedback` ||
    pathname === `/menu/${restoSlug}/products`;

  // Animation variants for page transitions
  const variants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    document.body.style.backgroundColor = customization?.selectedBgColor;
  }, [customization?.selectedBgColor]);

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
