import axios from "axios";
import { BACKEND_URL } from "../common/constants";

export const fetchProducts = async () => {
    return await axios.get(BACKEND_URL + "/api/product/list");
};
