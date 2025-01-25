import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOKEN } from "./common/constants";

const App = () => {
    const initialToken = localStorage.getItem(TOKEN) || "";
    const [token, setToken] = useState<string>(initialToken);

    useEffect(() => {
        localStorage.setItem(TOKEN, token);
    }, [token]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <ToastContainer />
            <Navbar token={token} setToken={setToken}>
                {/* when user is logged in, token is present in localStorage */}
                {token === "" ? (
                    <Login setToken={setToken} />
                ) : (
                    <>
                        <hr />
                        <div className="flex w-full">
                            <Sidebar />
                            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                                <Routes>
                                    <Route
                                        path="/add"
                                        element={<Add token={token} />}
                                    />
                                    <Route
                                        path="/list"
                                        element={<List token={token} />}
                                    />
                                    <Route
                                        path="/orders"
                                        element={<Orders token={token} />}
                                    />
                                </Routes>
                            </div>
                        </div>
                    </>
                )}
            </Navbar>
        </div>
    );
};

export default App;
