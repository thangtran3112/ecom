import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetTransactionsResponse,
  IProduct,
  ITransaction,
  IUser,
} from "../fixtures/types";
const REACT_APP_BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

interface GetTransactionParamsProps {
  page: number;
  pageSize: number;
  sort: string;
  search: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["User", "Products", "Customers", "Transactions"],
  endpoints: (build) => ({
    getUser: build.query<IUser, string>({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query<IProduct[], undefined>({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query<IUser[], undefined>({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query<
      GetTransactionsResponse,
      GetTransactionParamsProps
    >({
      query: ({ page, pageSize, sort, search }: GetTransactionParamsProps) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
} = api;
