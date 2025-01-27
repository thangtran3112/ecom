import axios from "axios";
import { BACKEND_URL } from "../common/constants";

export const apiRegister = async (
    name: string,
    email: string,
    password: string
) => {
    return await axios.post(BACKEND_URL + "/api/user/register", {
        name,
        email,
        password,
    });
};

export const apiLogin = async (email: string, password: string) => {
    return await axios.post(BACKEND_URL + "/api/user/login", {
        email,
        password,
    });
};
