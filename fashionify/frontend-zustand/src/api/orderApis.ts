import axios from "axios";
import { BACKEND_URL } from "../common/constants";
import { IOrderData } from "../pages/PlaceOrder";

export const apiGetUserOrders = async (token: string) => {
    return await axios.post(
        BACKEND_URL + "/api/order/userorders",
        {},
        { headers: { token } }
    );
};

export const apiPlaceOrder = async (token: string, orderData: IOrderData) => {
    return await axios.post(BACKEND_URL + "/api/order/place", orderData, {
        headers: { token },
    });
};

export const apiStripePayment = async (
    token: string,
    orderData: IOrderData
) => {
    return await axios.post(BACKEND_URL + "/api/order/stripe", orderData, {
        headers: { token },
    });
};

export const apiVerifyStripe = async (
    token: string,
    success: string | null,
    orderId: string | null
) => {
    return await axios.post(
        BACKEND_URL + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }
    );
};
