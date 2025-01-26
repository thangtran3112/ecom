/* eslint-disable @typescript-eslint/no-explicit-any */

import { devtools } from "zustand/middleware";
import { IProduct } from "../interfaces/Product";
import { create } from "zustand";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../common/constants";
import axios from "axios";

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
    devtools((set) => ({
        products: [],
        search: "",
        setSearch: (value) => set({ search: value }),
        showSearch: true,
        setShowSearch: (value) => set({ showSearch: value }),
        setProducts: (arr) => set({ products: arr }),
        fetchProducts: async () => {
            try {
                const response = await axios.get(
                    BACKEND_URL + "/api/product/list"
                );
                if (response.data.success) {
                    set({ products: response.data.products.reverse() });
                } else {
                    toast.error(response.data.message);
                }
            } catch (error: any) {
                console.log(error);
                toast.error(error.message);
            }
        },
    }))
);

export default useProductsStore;
