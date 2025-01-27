import React, { useEffect } from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import useProductsStore from "./stores/productsStore";
import useCartStore from "./stores/cartStore";
import userPersistStore from "./stores/persistStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

    const { fetchProducts } = useProductsStore();
    const { getUserCart } = useCartStore();
    const { token, setToken } = userPersistStore();

    // better to migrate to react-query
    useEffect(() => {
        const init = async () => {
            await fetchProducts();
            // if (!token && localStorage.getItem("token")) {
            //     setToken(localStorage.getItem("token") as string);
            // }
            await getUserCart();
        };
        init();
    }, [fetchProducts, getUserCart, setToken, token]);

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <ToastContainer />
                <Navbar />
                <SearchBar />
                <Routes>
                    {/* Routes go here */}
                    <Route path="/" element={<Home />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/product/:productId" element={<Product />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/place-order" element={<PlaceOrder />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
                <Footer />
            </div>
        </QueryClientProvider>
    );
};

export default App;
