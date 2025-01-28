import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useGetProducts } from "../hooks/useProducts";
import useCartStore from "../stores/cartStore";
import userPersistStore from "../stores/persistStore";
import useProductsStore from "../stores/productsStore";

const Layout = () => {
    const { setProducts } = useProductsStore();
    const { isLoadingProducts, data: products } = useGetProducts();
    const { getUserCart } = useCartStore();
    userPersistStore();

    useEffect(() => {
        if (!isLoadingProducts && products) {
            setProducts(products);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingProducts, products]);

    // better to migrate to react-query
    useEffect(() => {
        const init = async () => {
            if (!isLoadingProducts && products) {
                await getUserCart();
            }
            // await fetchProducts();
        };
        init();
    }, [getUserCart, isLoadingProducts, products]);

    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <ToastContainer />
            <Navbar />
            <SearchBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Layout;
