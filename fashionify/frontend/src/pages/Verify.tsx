/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = useCallback(async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }
      );

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
  }, [backendUrl, navigate, orderId, setCartItems, success, token]);

  useEffect(() => {
    verifyPayment();
  }, [token, verifyPayment]);

  return (
    <div>
      Thank you for the order, you will be redirected to home page shortly...
    </div>
  );
};

export default Verify;
