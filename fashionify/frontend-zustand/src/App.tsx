import React from "react";
import { RouterProvider } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./routes/routes";

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60, // 1 minute in ms
                retry: 1,
                retryDelay: (attempIndex) =>
                    Math.min(1000 * 2 ** attempIndex, 30000),
                refetchOnWindowFocus: true,
            },
        },
    });
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};

export default App;
