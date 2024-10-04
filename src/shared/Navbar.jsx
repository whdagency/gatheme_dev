import React, { useState } from "react";
import { ShoppingBag, Star, MessageCircle, User, Plus, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  BillIcon,
  CartActiveIcon,
  CartInactiveIcon,
  FeedbackActiveIcon,
  FeedbackInactiveIcon,
  HomeActiveIcon,
  HomeInactiveIcon,
  InfoActiveIcon,
  InfoInactiveIcon,
} from "../components/icons";
import CallWaiter from "../modals/call-waiter";
import RequestBill from "../modals/request-bill";

const Navbar = ({ hideCallToActionBtn }) => {
  const { restoSlug, table_id } = useMenu();

  const navLinks = [
    {
      label: "Home",
      href: `/menu/${restoSlug}?table_id=${table_id}`,
      icon: ShoppingBag,
      name: "home",
    },
    {
      label: "My Cart",
      href: `/menu/${restoSlug}/cart?table_id=${table_id}`,
      icon: Star,
      name: "cart",
    },
    {
      label: "Feedback",
      href: `/menu/${restoSlug}/feedback?table_id=${table_id}`,
      icon: MessageCircle,
      name: "feedback",
    },
    {
      label: "Restaurant",
      href: `/menu/${restoSlug}/info?table_id=${table_id}`,
      icon: User,
      name: "info",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0">
      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between max-w-md px-4 py-3 mx-auto bg-white border-t">
        {navLinks.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}

        {/* Call to Action Button as part of the navigation */}
        {!hideCallToActionBtn && <ToggleNavActionButton />}

        {/* Border bottom */}
        {/* <div
          className="absolute hidden md:block md:bottom-3 -translate-x-1/2 left-1/2 right-0 rounded-[104.8px] border-b-4 border-[#191D31]"
          style={{ width: "141.48px" }}
        /> */}
      </div>
    </div>
  );
};

export default Navbar;

const NavItem = ({ href, label, ...rest }) => {
  const name = rest.name;
  const location = useLocation();

  // Extract the pathname from href (ignoring query params)
  const hrefPathname = new URL(href, window.location.origin).pathname;

  // Check if the current pathname matches the href's pathname
  const isActive = location.pathname === hrefPathname;
  const isProductsPage = location.pathname.split("/")[3] === "products";

  const getCorrectIcon = (isActive) => {
    switch (name) {
      case "home":
        return isActive ? <HomeActiveIcon /> : <HomeInactiveIcon />;
      case "cart":
        return isActive ? <CartActiveIcon /> : <CartInactiveIcon />;
      case "feedback":
        return isActive ? <FeedbackActiveIcon /> : <FeedbackInactiveIcon />;
      case "info":
        return isActive ? <InfoActiveIcon /> : <InfoInactiveIcon />;
      default:
        return <HomeActiveIcon />;
    }
  };

  return (
    <NavLink to={href} className="flex flex-col items-center">
      <>
        {isProductsPage && name === "home" ? (
          <HomeActiveIcon />
        ) : (
          getCorrectIcon(isActive)
        )}
        <span
          className={`text-[12.576px] font-medium mt-2 leading-[16.394px]`}
          style={{
            color:
              isProductsPage && name === "home"
                ? "#F86A2E"
                : isActive
                ? "#F86A2E"
                : "#A7AEC1",
          }}
        >
          {isProductsPage ? "Home" : label}
        </span>
      </>
    </NavLink>
  );
};

const ToggleNavActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="-top-16 right-5 absolute">
      <AnimatePresence>
        {isExpanded && (
          <>
            <CallWaiter />

            <RequestBill />
          </>
        )}
      </AnimatePresence>
      <motion.button
        className="flex items-center justify-center rounded-full shadow-lg w-[52px] h-[52px] p-3"
        onClick={toggleExpand}
        animate={{ rotate: isExpanded ? 90 : 0 }}
        transition={{ duration: 0.5, type: "tween" }}
        style={{ background: "#F86A2E" }}
      >
        {isExpanded ? (
          <X size={30} color={"white"} />
        ) : (
          <Plus size={30} color={"white"} />
        )}
      </motion.button>
    </div>
  );
};
