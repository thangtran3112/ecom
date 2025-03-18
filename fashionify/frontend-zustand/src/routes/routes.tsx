import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import NotFound from "../layout/NotFound";
import Home from "../pages/Home";
import Collection from "../pages/Collection";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import PlaceOrder from "../pages/PlaceOrder";
import Orders from "../pages/Orders";
import Verify from "../pages/Verify";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/collection",
                element: <Collection />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/product/:productId",
                element: <Product />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/place-order",
                element: <PlaceOrder />,
            },
            {
                path: "/orders",
                element: <Orders />,
            },
            {
                path: "/verify",
                element: <Verify />,
            },
        ],
    },
]);
