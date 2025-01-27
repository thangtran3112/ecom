import { toast } from "react-toastify";
import { IProduct } from "../interfaces/Product";

export interface ICartItems {
    [key: string]: {
        [key: string]: number;
    };
}

export const getCartAmount = (products: IProduct[], cartItems: ICartItems) => {
    let totalAmount = 0;
    for (const productId in cartItems) {
        const itemInfo = products.find((product) => product._id === productId);

        if (!itemInfo) {
            toast.error(`Unknown Error, Product not found for ${productId}`);
            continue;
        }

        for (const productSize in cartItems[productId]) {
            try {
                if (cartItems[productId][productSize] > 0) {
                    totalAmount +=
                        itemInfo.price * cartItems[productId][productSize];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    return totalAmount;
};
