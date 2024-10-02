import { useContext } from "react";
import { AppContext } from "../providers/AppProvider";

export const useMenu = () => useContext(AppContext);
