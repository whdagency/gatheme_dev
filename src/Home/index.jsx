import React from "react";
import Promotion from "./Promotion";
import Categories from "./Categories";
import Products from "./Products";
import Banner from "./Banner";
import Search from "./Search";
import AnimatedLayout from "../shared/AnimateLayout";

const Home = () => {
  return (
    <div className="scrollbar-hide ">
      {/* Header */}
      <Banner />

      {/* Search Bar */}
      <Search />

      {/* Promotion */}
      <AnimatedLayout y={50}>
        <Promotion />
      </AnimatedLayout>

      {/* Main Content */}
      <div className="scrollbar-hide relative">
        <Categories />

        {/* Products - scrollable */}
        <div className="h-[calc(100vh-60px)] overflow-y-auto scrollbar-hide">
          <Products />
        </div>
      </div>
    </div>
  );
};

export default Home;
