import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import NotFound from "../shared/NotFound";
import ProductDetailsHeader from "./ProductDetailsHeader";
import ProductDetailsContent from "./ProductDetailsContent";
import AnimatedLayout from "../shared/AnimateLayout";

const ProductDetails = () => {
  const { products } = useMenu();
  const pathname = useLocation().pathname;
  const params = useParams();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [api, setApi] = useState();

  const product = products.filter(
    (product) => product.id === parseInt(params.productId)
  )[0];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentSlide(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!product) {
    return <NotFound />;
  }

  const { video, image1, image2, image3, image4 } = product;

  const mediaItems = [
    ...(video ? [video] : []),
    ...(image1 ? [image1] : []),
    ...(image2 ? [image2] : []),
    ...(image3 ? [image3] : []),
    ...(image4 ? [image4] : []),
  ];

  const totalSlides = mediaItems.length;

  return (
    <AnimatedLayout>
      <div className="pb-32">
        <ProductDetailsHeader
          mediaItems={mediaItems}
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          setApi={setApi}
        />
        <ProductDetailsContent
          product={product}
          productId={parseInt(params.productId)}
        />
      </div>
    </AnimatedLayout>
  );
};

export default ProductDetails;
