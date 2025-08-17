import axios from "axios";
import { BASE_URL } from "../utils/AppConst";

export const axiosAuth = () => {
  const token = localStorage.getItem("token") as string;
  console.log("axiosAuth - BASE_URL:", BASE_URL);
  console.log("axiosAuth - Token:", token);
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
