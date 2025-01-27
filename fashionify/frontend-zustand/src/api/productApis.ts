import axios from "axios";
import { BACKEND_URL } from "../common/constants";

export const apiGetProducts = async () => {
    return await axios.get(BACKEND_URL + "/api/product/list");
};
