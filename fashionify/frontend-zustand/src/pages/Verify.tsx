/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useCartStore from "../stores/cartStore";
import { apiVerifyStripe } from "../api/orderApis";
import userPersistStore from "../stores/persistStore";

const Verify = () => {
    const { token } = userPersistStore();
    const { setCartItems } = useCartStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const verifyPayment = useCallback(async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await apiVerifyStripe(token, success, orderId);

            if (response.data.success) {
                setCartItems({});
                navigate("/orders");
            } else {
                //send user to /cart page to retry payment
                navigate("/cart");
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message);
        }
    }, [navigate, orderId, setCartItems, success, token]);

    useEffect(() => {
        verifyPayment();
    }, [token, verifyPayment]);

    return (
        <div>
            Thank you for the order, you will be redirected to home page
            shortly...
        </div>
    );
};

export default Verify;
