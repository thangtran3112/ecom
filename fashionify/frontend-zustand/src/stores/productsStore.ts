/* eslint-disable @typescript-eslint/no-explicit-any */
import { devtools } from "zustand/middleware";
import { IProduct } from "../interfaces/Product";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { apiGetProductsWithErrorHandling } from "../hooks/useProducts";

interface ProductState {
    products: IProduct[];
    search: string;
    showSearch: boolean;
    setSearch: (value: string) => void;
    setShowSearch: (value: boolean) => void;
    setProducts: (arr: IProduct[]) => void;
    fetchProducts: () => Promise<void>;
}

const useProductsStore = create<ProductState>()(
    devtools(
        immer((set) => ({
            products: [],
            search: "",
            setSearch: (value) => set({ search: value }),
            showSearch: true,
            setShowSearch: (value) => set({ showSearch: value }),
            setProducts: (arr) => set({ products: arr }),
            fetchProducts: async () => {
                // this can be used, if we are not using react query.
                const products = await apiGetProductsWithErrorHandling();
                set({ products: products });
            },
        }))
    )
);

export default useProductsStore;
