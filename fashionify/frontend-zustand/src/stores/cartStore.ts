/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import { apiGetUserCart, apiSaveCart, apiUpdateCart } from "../api/cartApis";
import { ICartItems } from "../common/utils";
import { devtools } from "zustand/middleware";

interface CartState {
    cartItems: ICartItems;
    currency: string;
    delivery_fee: number;
    token: string;
    setToken: (token: string) => void;
    setCartItems: (value: ICartItems) => void;
    addToCart: (itemId: string, size: string) => Promise<void>;
    getCartCount: () => number;
    updateQuantity: (
        itemId: string,
        size: string,
        quantity: number
    ) => Promise<void>;
    getUserCart: () => Promise<void>;
}

const useCartStore = create<CartState>()(
    devtools(
        immer((set, get) => ({
            cartItems: {},
            currency: "$",
            delivery_fee: 10,
            token: "",
            setToken: (value) =>
                set((state) => {
                    state.token = value;
                }),
            setCartItems: (value) =>
                set((state) => {
                    state.cartItems = value;
                }),
            addToCart: async (itemId, size) => {
                if (!size) {
                    toast.error("Select Product Size");
                    return;
                }

                const cartData = structuredClone(get().cartItems);

                if (cartData[itemId]) {
                    if (cartData[itemId][size]) {
                        cartData[itemId][size] += 1;
                    } else {
                        cartData[itemId][size] = 1;
                    }
                } else {
                    cartData[itemId] = {};
                    cartData[itemId][size] = 1;
                }
                get().setCartItems(cartData);
                const token = get().token;
                if (token) {
                    try {
                        apiSaveCart(token, itemId, size);
                    } catch (error: any) {
                        console.log(error);
                        toast.error(error.message);
                    }
                }
            },
            getCartCount: () => {
                let totalCount = 0;
                const cartItems = get().cartItems;
                for (const productId in cartItems) {
                    for (const productSize in cartItems[productId]) {
                        try {
                            if (cartItems[productId][productSize] > 0) {
                                totalCount += cartItems[productId][productSize];
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
                return totalCount;
            },
            updateQuantity: async (itemId, size, quantity) => {
                const cartItems = get().cartItems;
                const cartData = structuredClone(cartItems);

                cartData[itemId][size] = quantity;

                get().setCartItems(cartData);
                const token = get().token;
                if (token) {
                    try {
                        apiUpdateCart(token, itemId, size, quantity);
                    } catch (error: any) {
                        console.log(error);
                        toast.error(error.message);
                    }
                }
            },
            getUserCart: async () => {
                try {
                    const response = await apiGetUserCart(get().token);
                    if (response.data.success) {
                        get().setCartItems(response.data.cartData);
                    }
                } catch (error: any) {
                    console.log(error);
                    toast.error(error.message);
                }
            },
        }))
    )
);

export default useCartStore;
