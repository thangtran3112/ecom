/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { IProduct } from "../interfaces/Product";
import ProductItem from "../components/ProductItem";
import useProductsStore from "../stores/productsStore";

enum SortType {
    Relavent = "relavent",
    LowHigh = "low-high",
    HighLow = "high-low",
}

//Do not Search if the search input is less than 3 character
//This is to avoid constant re-rendering
const MIN_SEARCH_LENGTH = 3;

const Collection = () => {
    const { products, search, showSearch } = useProductsStore();
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState<IProduct[]>([]);
    const [category, setCategory] = useState<string[]>([]);
    const [subCategory, setSubCategory] = useState<string[]>([]);
    const [sortType, setSortType] = useState<SortType>(SortType.Relavent);

    const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (category.includes(e.target.value.trim())) {
            setCategory((prev: string[]) =>
                prev.filter((a) => a !== e.target.value)
            );
        } else {
            setCategory((prev: string[]) => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (subCategory.includes(e.target.value.trim())) {
            setSubCategory((prev: string[]) =>
                prev.filter((a) => a !== e.target.value)
            );
        } else {
            setSubCategory((prev: string[]) => [...prev, e.target.value]);
        }
    };

    const applyFilter = () => {
        let productsCopy = products.slice();

        // If search is set, search by product name
        if (showSearch && search && search.length >= MIN_SEARCH_LENGTH) {
            productsCopy = productsCopy.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                category.includes(item.category)
            );
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                subCategory.includes(item.subCategory)
            );
        }

        setFilterProducts(productsCopy);
    };

    const sortProduct = async () => {
        const fpCopy = filterProducts.slice();

        switch (sortType) {
            case "low-high":
                setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
                break;

            case "high-low":
                setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
                break;

            default:
                applyFilter();
                break;
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            applyFilter();
        }, 1000); // Avoid constant re-rendering. This could be done with useDebounce hook as well

        // Cleanup function to clear the timeout if dependencies change
        return () => {
            clearTimeout(handler);
        };
    }, [category, subCategory, search, showSearch, products]);

    useEffect(() => {
        sortProduct();
    }, [sortType]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* Filter Options */}
            <div className="min-w-60">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >
                    FILTERS
                    <img
                        className={cn(
                            "h-3 sm:hidden",
                            `${showFilter ? " rotate-90" : ""}`
                        )}
                        src={assets.dropdown_icon}
                        alt="Filter Arrowdown Icon"
                    />
                </p>

                {/* Category Filter */}
                <div
                    className={cn(
                        "border border-gray-300 pl-5 py-3 mt-6",
                        showFilter ? "" : "hidden",
                        "sm:block"
                    )}
                >
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                value="Men"
                                onChange={toggleCategory}
                                type="checkbox"
                            />
                            Men
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                value="Women"
                                onChange={toggleCategory}
                                type="checkbox"
                            />
                            Women
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                value="Kids"
                                onChange={toggleCategory}
                                type="checkbox"
                            />
                            Kids
                        </p>
                    </div>
                </div>

                {/* Sub Category Filter */}
                <div
                    className={cn(
                        "border border-gray-300 pl-5 py-3 my-5",
                        showFilter ? "" : "hidden",
                        "sm:block"
                    )}
                >
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                value="Topwear"
                                onChange={toggleSubCategory}
                                type="checkbox"
                            />
                            Topwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                value="Bottomwear"
                                onChange={toggleSubCategory}
                                type="checkbox"
                            />
                            Bottomwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                value="Winterwear"
                                onChange={toggleSubCategory}
                                type="checkbox"
                            />
                            Winterwear
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side, Displaying filtered Products */}

            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={"ALL"} text2={"COLLECTIONS"} />

                    {/* Product Sort */}
                    <select
                        onChange={(e) =>
                            setSortType(e.target.value as SortType)
                        }
                        className="border-2 border-gray-300 text-sm px-2"
                        name=""
                        id=""
                    >
                        <option value={SortType.Relavent}>
                            Sort by: Relavent
                        </option>
                        <option value={SortType.LowHigh}>
                            Sort by: Low to High
                        </option>
                        <option value={SortType.HighLow}>
                            Sort by: High to Low
                        </option>
                    </select>
                </div>

                {/* Map Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {filterProducts.map((item, index) => (
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
        </div>
    );
};

export default Collection;
