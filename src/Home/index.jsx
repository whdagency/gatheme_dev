import React from "react";
import Promotion from "./Promotion";
import Categories from "./Categories";
import Products from "./Products";
import Banner from "./Banner";
import Search from "./Search";
import AnimatedLayout from "../shared/AnimateLayout";

const Home = () => {
  return (
    <>
      {/* Header */}
      <Banner />

      {/* Search Bar */}
      <Search />

      {/* Promotion */}
      <AnimatedLayout y={50}>
        <Promotion />
      </AnimatedLayout>

      {/* Categories */}
      <Categories />

      {/* Products */}
      <Products />
    </>
  );
};

export default Home;
