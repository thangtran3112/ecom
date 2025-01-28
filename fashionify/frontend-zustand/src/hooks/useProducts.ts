/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetProducts } from "../api/productApis";
import { PRODUCTS_KEY } from "./cache-keys";
import { toast } from "react-toastify";
import { IProduct } from "../interfaces/Product";

export const apiGetProductsWithErrorHandling = async () => {
    try {
        try {
            const response = await apiGetProducts();
            if (response.data.success) {
                return response.data.products.reverse() as IProduct[];
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message);
        }
    } catch (error: any) {
        throw new Error("Failed to fetch products: " + error?.message);
    }
};

export const useGetProductsLazy = () => {
    const queryClient = useQueryClient();
    return () =>
        queryClient.ensureQueryData({
            queryKey: [PRODUCTS_KEY],
            queryFn: () => apiGetProductsWithErrorHandling(), // should we use async here?
        });
};

export const useGetProducts = () => {
    const queryClient = useQueryClient();

    function refetchProducts() {
        queryClient.invalidateQueries({
            queryKey: [PRODUCTS_KEY], // or use predicate here for more granular control
        });
    }

    const { isLoading, isFetching, isRefetching, data, error } = useQuery({
        queryKey: [PRODUCTS_KEY],
        queryFn: () => apiGetProductsWithErrorHandling(),
    });

    return {
        isLoadingProducts: isLoading || isFetching || isRefetching,
        refetchProducts,
        data,
        error,
    };
};
