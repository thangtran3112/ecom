import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const REACT_APP_BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["User"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery } = api;
