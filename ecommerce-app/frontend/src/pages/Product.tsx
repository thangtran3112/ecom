import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Product as ProductInterface } from "../interfaces/Product";
import { assets } from "../assets/assets";
import { cn } from "../lib/utils";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState<ProductInterface>();
  const [image, setImage] = useState<string>("");
  const [size, setSize] = useState<string>("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        // console.log(item);
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* -------- Product Row ---------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* -------- Product Images ---------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* All of Images in smaller resolution */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                src={item}
                alt="Image"
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="Main Image" />
          </div>
        </div>
        {/* -------- End Product Images ---------- */}

        {/* -------- Product Info ---------- */}
        {/* Use flex-1 to allow a flex item to grow and shrink as needed, ignoring its initial size 
          https://tailwindcss.com/docs/flex
        */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_dull_icon} alt="" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={cn(
                    `border py-2 px-4 bg-gray-100 `,
                    item === size ? "border-orange-500" : ""
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            ADD TO CART
          </button>
        </div>
        {/* -------- End of Product Info ---------- */}
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
