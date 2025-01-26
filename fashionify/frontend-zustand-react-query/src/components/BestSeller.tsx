import { useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { IProduct } from "../interfaces/Product";
import useProductsStore from "../stores/productsStore";

const BestSeller = () => {
    const { products } = useProductsStore();
    const [bestSeller, setBestSeller] = useState<IProduct[]>([]);

    useEffect(() => {
        if (products.length === 0) return;
        const bestProducts = products.filter(
            (item: IProduct) => item.bestseller
        );

        //this can be done with infinite query
        setBestSeller(bestProducts.slice(0, 5));
    }, [products]);

    return (
        <div className="my-10">
            <div className="text-center text-3xl py-8">
                <Title text1="BEST" text2="SELLERS" />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {bestSeller.map((item, index) => (
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

export default BestSeller;
