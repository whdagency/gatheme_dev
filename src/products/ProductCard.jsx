import { Star, X } from "lucide-react";
import { Timer } from "../components/icons";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { STORAGE_URL } from "../lib/api";

const ProductCard = ({ image, title, rating, time, price, currency, id }) => {
  const navigate = useNavigate();
  const { restoSlug, table_id, customization } = useMenu();

  const handleGotoProductDetails = () => {
    navigate(`/menu/${restoSlug}/products/${id}?table_id=${table_id}`);
  };

  return (
    <div
      className="flex items-center gap-4 cursor-pointer"
      onClick={handleGotoProductDetails}
    >
      <img
        src={`${STORAGE_URL}/${image}`}
        alt={title}
        className="rounded-2xl object-cover w-20 h-20 shadow-sm"
        onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
      />

      <div className="flex items-center justify-between flex-1 gap-2">
        <div className="flex flex-col items-start justify-between gap-5">
          <h3
            className="font-semibold text-black capitalize"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {title}
          </h3>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="whitespace-nowrap flex items-center gap-1">
              <Star className="w-4 h-4 text-[#F5A816] fill-current" />
              <span
                className="font-semibold text-black"
                style={{
                  color: customization?.selectedTextColor,
                }}
              >
                {rating}
              </span>
            </div>
            <div className="whitespace-nowrap flex items-center gap-1">
              <Timer fill={customization?.selectedPrimaryColor} />
              <span
                className="font-semibold text-[#A6ADB4]"
                style={{
                  color: customization?.selectedSecondaryColor,
                }}
              >
                {time}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-5">
          <span
            className="text-base font-semibold text-black"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {price.toFixed(2)}{" "}
            <span
              className="text-xs text-[#F86A2F] font-medium"
              style={{
                color: customization?.selectedPrimaryColor,
              }}
            >
              {currency}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
