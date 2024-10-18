/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetTransactionsResponse,
  IGeography,
  IOverallStat,
  IPerformanceResponse,
  IProduct,
  ISalesDashboard,
  IUser,
} from "../fixtures/types";
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface GetTransactionParamsProps {
  page: number;
  pageSize: number;
  sort: string;
  search: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_API_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
  ],
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
    getGeography: build.query<IGeography[], undefined>({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query<IOverallStat, undefined>({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query<IUser[], undefined>({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query<IPerformanceResponse, string>({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query<ISalesDashboard, undefined>({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;
