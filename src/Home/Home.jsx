import React from "react";
import Promotion from "./Promotion";
import Categories from "./Categories";
import Products from "./Products";
import Banner from "./Banner";
import Search from "./Search";

const Home = () => {
  return (
    <>
      {/* Header */}
      <Banner />

      {/* Search Bar */}
      <Search />

      {/* Promotion */}
      <Promotion />

      {/* Categories */}
      <Categories />

      {/* Products */}
      <Products />
    </>
  );
};

export default Home;
