/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { IProduct } from "../interfaces/Product";

interface RelatedProductsProps {
    category: string;
    subCategory: string;
}

const RelatedProducts = ({ category, subCategory }: RelatedProductsProps) => {
    const [related, setRelated] = useState<IProduct[]>([]);

    const { products } = useContext(ShopContext);

    useEffect(() => {
        if (products.length > 0) {
            const productsCopy = products
                .slice()
                .filter((item) => category === item.category)
                .filter((item) => subCategory === item.subCategory);

            // Only display 5 related products
            setRelated(productsCopy.slice(0, 5));
        }
    }, [products]);

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1="RELATED" text2="PRODUCTS" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {related.map((item, index) => (
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

export default RelatedProducts;
