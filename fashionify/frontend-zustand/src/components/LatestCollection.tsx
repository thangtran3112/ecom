import React, { useEffect, useState } from "react";
import Title from "./Title";
import { IProduct } from "../interfaces/Product";
import ProductItem from "./ProductItem";
import useProductsStore from "../stores/productsStore";

const LatestCollection = () => {
    const { products } = useProductsStore();
    const [latestProducts, setLatestProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        if (products.length === 0) return;
        setLatestProducts(products.slice(0, 10));
    }, [products]);

    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1="LATEST" text2="ARRIVALS" />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the.
                </p>
            </div>
            {/* Rendering Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {latestProducts.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id as string}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    );
};

export default LatestCollection;
