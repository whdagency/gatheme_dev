import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowLeft } from "lucide-react";
import { STORAGE_URL } from "../lib/api";
import { useTranslation } from "react-i18next";

const ProductDetailsHeader = ({
  mediaItems,
  currentSlide,
  totalSlides,
  setApi,
}) => {
  const { t } = useTranslation("global");

  return (
    <div className="relative -mt-3">
      {/* Title and Back Button */}
      <button
        style={{
          boxShadow: "0px 1.633px 1.633px 0px rgba(0, 0, 0, 0.25)",
          borderRadius: "13.061px",
          background: "#FFF",
        }}
        onClick={() => window.history.back()}
        className="flex top-10 left-7 absolute z-50 w-fit items-center justify-center p-[8.163px] gap-[8.163px]"
      >
        <ArrowLeft size={25} color="black" />
      </button>

      <h2 className="top-12 absolute z-50 left-1/2 -translate-x-1/2 text-xl font-semibold text-center text-white">
        {t("productDetails.title")}
      </h2>

      {/* Slide Counter */}
      {totalSlides > 1 && (
        <div
          className="right-9 bottom-4 absolute z-50 flex items-center justify-center gap-3 p-2"
          style={{
            border: "1px solid rgba(64, 53, 53, 0.01)",
            background: "rgba(64, 53, 53, 0.51)",
            backdropFilter: "blur(5.099999904632568px)",
            borderRadius: "9px",
          }}
        >
          <p className="z-10 text-sm font-medium text-center text-white">
            {currentSlide}/{totalSlides}
          </p>
        </div>
      )}

      {/* Carousel */}
      <Carousel
        opts={{
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent className="rounded-[20px_20px_24px_24px] h-[281px]">
          {mediaItems.map((item, index) => (
            <CarouselItem key={index} className="bg-transparent">
              <div className="relative flex items-center justify-center overflow-hidden rounded-[20px_20px_24px_24px] object-cover w-full h-[281px]">
                <div className="bg-black/50 absolute inset-0 z-10" />
                {item.includes(".mp4") ? (
                  <video
                    src={`${STORAGE_URL}/${item}`}
                    className="rounded-[20px_20px_24px_24px] object-cover w-full h-[281px] z-0"
                    autoPlay
                    muted
                    playsInline
                    loop
                    alt="Video slide"
                  />
                ) : (
                  <img
                    src={`${STORAGE_URL}/${item}`}
                    className="rounded-[20px_20px_24px_24px] object-cover w-full h-[281px] z-0"
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/placeholder-image.png")
                    }
                    alt="Slide"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductDetailsHeader;
