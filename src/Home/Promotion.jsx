import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMenu } from "../hooks/useMenu";
import fetchApiData from "../lib/fetch-data";
import { STORAGE_URL } from "../lib/api";

const Promotion = () => {
  const { restos, resInfo, searchProductTerm } = useMenu();
  const [promos, setPromos] = useState([]);
  const [seeAllPromos, setSeeAllPromos] = useState(false);

  useEffect(() => {
    fetchApiData(`/banners/${restos?.id}`, []).then((data) => {
      if (!data || data.length === 0) {
        setPromos([]);
        return;
      }

      const filteredData = data.filter((item) =>
        item?.image?.startsWith("promo")
      );

      if (!filteredData || filteredData.length === 0) {
        setPromos([]);
        return;
      }

      setPromos(filteredData);
    });
  }, [restos?.id]);

  return (
    <div
      className={`px-4 mt-4 ${
        promos.length === 0 || searchProductTerm.length > 0 ? "hidden" : ""
      }
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Promotion 🔥</h2>
        <button
          className="text-sm text-orange-500"
          onClick={() => setSeeAllPromos((prev) => !prev)}
        >
          {seeAllPromos ? "See Less" : "See All"}
        </button>
      </div>

      <div className="scrollbar-hide flex px-4 pb-4 -mx-4 space-x-4 overflow-x-auto">
        {promos?.slice(0, seeAllPromos ? promos?.length : 3)?.map((promo) => (
          <PromotionCard
            key={promo?.id}
            image={`${STORAGE_URL}/${promo?.image}`}
            title={promo?.title}
            price={parseFloat(promo?.price)}
            originalPrice={parseFloat(promo?.price) * 1.2}
            currency={resInfo?.currency || "MAD"}
          />
        ))}
      </div>
    </div>
  );
};

export default Promotion;

const PromotionCard = ({
  image,
  title,
  price,
  originalPrice,
  currency = "MAD",
}) => {
  return (
    <div className="relative flex-shrink-0 w-[194px]">
      <div className="rounded-[30px] relative h-[245px] overflow-hidden">
        <img src={image} alt={title} className="object-cover w-full h-full" />
        <div className="bg-gradient-to-t from-black/50 to-transparent absolute inset-0" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-3">
        <div
          style={{
            border: "1px solid rgba(64, 53, 53, 0.01)",
            background: "rgba(64, 53, 53, 0.51)",
            backdropFilter: "blur(5.099999904632568px)",
          }}
          className="rounded-[15px] p-2 shrink-0"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-xs font-semibold text-white capitalize">
              {title}
            </h3>
            <button className="w-6 h-6 p-1 flex items-center justify-center text-white bg-[#F86A2E] rounded-[5.714px]">
              <Plus size={15} />
            </button>
          </div>

          <div className="flex items-center mt-2">
            <span className="font-semibold text-[13px] text-white">
              {price.toFixed(2)}{" "}
              <span className="text-xs text-orange-500">{currency}</span>
            </span>
            <span className="ml-2 text-white text-[13px] font-medium opacity-60 line-through">
              {originalPrice.toFixed(2)}{" "}
              <span className="text-xs">{currency}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
