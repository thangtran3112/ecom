import axios from "axios";
import { BACKEND_URL } from "../common/constants";

export const apiSaveCart = async (
    token: string,
    itemId: string,
    size: string
) => {
    return await axios.post(
        BACKEND_URL + "/api/cart/add",
        { itemId, size },
        { headers: { token } }
    );
};

export const apiUpdateCart = async (
    token: string,
    itemId: string,
    size: string,
    quantity: number
) => {
    await axios.post(
        BACKEND_URL + "/api/cart/update",
        { itemId, size, quantity },
        { headers: { token } }
    );
};

export const apiGetUserCart = async (token: string) => {
    return await axios.post(
        BACKEND_URL + "/api/cart/get",
        {},
        { headers: { token } }
    );
};
