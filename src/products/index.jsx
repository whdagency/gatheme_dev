import React from "react";
import { Navigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const Products = () => {
  const { restoSlug, table_id } = useMenu();
  return <Navigate to={`/menu/${restoSlug}?table_id=${table_id}`} />;
};

export default Products;
