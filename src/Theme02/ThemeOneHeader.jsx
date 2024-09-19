import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import ThemeOneInfo from "./Info/ThemeOneInfo";
import ThemeOneAchat from "./Achat/ThemeOneAchat";

const ThemeOneHeader = () => {
  const location = useLocation();
  const { restoSlug, restos, resInfo, customization, table_id } = useMenu();
  const DEFAULT_THEME = {
    id: 4,
    selectedBgColor: "#fff",
    selectedHeader: "logo-header",
    selectedLayout: "theme-grid",
    selectedPrimaryColor: "#000",
    selectedSecondaryColor: "#6B7280",
    selectedTheme: 1,
    selectedTextColor: "#fff",
    selectedIconColor: "#fff",
    isDefault: true,
  };
  return (
    <header
      style={{ backgroundColor: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}

      className="md:max-w-2xl md:w-full md:top-2 fixed top-0 z-50 flex items-center justify-between w-screen px-5 py-3 mx-auto uppercase bg-white shadow"
    >
      <Link
        to={`/menu/${restoSlug}?table_id=${table_id}`}
        className="flex items-center gap-2 font-bold"
        style={{ color: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}

      >
        <span className={`${restos.name?.length > 20 ? "text-[13px]": "text-xl"} md:text-2xl whitespace-nowrap text-black`}>
          {restos.name || "Garista"}
        </span>
      </Link>

      <ul className="flex items-center gap-6">
        <ThemeOneInfo
          activeLink={location.pathname === `/menu/${restoSlug}/info`}
        />

        <ThemeOneAchat
          activeLink={location.pathname === `/menu/${restoSlug}/Achat`}
        />
      </ul>
    </header>
  );
};

export default ThemeOneHeader;

