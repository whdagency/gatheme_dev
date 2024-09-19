import React, { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import ThemeOneHeader from "./ThemeOneHeader";
import ThemeOneBanner from "./Banner/ThemeOneBanner";
import ThemeDishes from "./ThemeDishes";
import { Accordion } from "@/components/ui/accordion";
import ThemeOneFooter from "./Footer/ThemeOneFooter";

const ThemeOne = () => {
  const { customization, dishes, categories } = useMenu();
  const [selectedItem, setSelectedItem] = useState([])
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
  const categoriesWithOrder = categories.filter(category => category.orderCategorie !== undefined);
  categoriesWithOrder.sort((a, b) => a.orderCategorie - b.orderCategorie);
  const dishesByCategory = (catId) => {
    const filteredDishes = dishes.filter((dish) => dish.category_id === catId);
    return filteredDishes;
  };

  return (
    <section
      style={{
        color: customization?.isDefault == false ? customization?.selectedTextColor : DEFAULT_THEME.selectedTextColor,
      }}
      className="h-[100%]  text-black flex  flex-col items-center md:justify-center min-h-screen"
    >
      <div
        style={{ backgroundColor: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor }}
        className="max-w-2xl md:shadow md:h-[95vh] w-full md:overflow-y-scroll oveflow-x-hidden scrollbar-hide pb-20 relative"
      >
        <ThemeOneHeader />

        <ThemeOneBanner />

        <div className="flex flex-col gap-0 px-5">
          {categoriesWithOrder.map((category) => {
            const filteredDishes = dishesByCategory(category.id);

            if (filteredDishes.length === 0) {
              return null;
            }

            return (
              <div
                key={category.id}
                className="flex flex-col justify-center gap-4 pt-5"
              >
                <Accordion
                  type="multiple"
                  defaultValue={[...categories.map((cat) => cat.id)]}
                  collapsible
                  className="flex flex-col gap-3"
                >
                  <ThemeDishes category={category} dishes={filteredDishes} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
                </Accordion>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center w-full">
          <ThemeOneFooter />
        </div>
      </div>
    </section>
  );
};

export default ThemeOne;
