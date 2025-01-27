/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { cn } from "../lib/utils";
import { toast } from "react-toastify";
import { PaymentMethod } from "../common/constants";
import { IProductOrderItem } from "../interfaces/Product";
import useProductsStore from "../stores/productsStore";
import useCartStore from "../stores/cartStore";
import { getCartAmount } from "../common/utils";
import { useNavigate } from "react-router";
import { apiPlaceOrder, apiStripePayment } from "../api/orderApis";
import userPersistStore from "../stores/persistStore";

interface IOrderForm {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
}

export interface IOrderData {
    address: IOrderForm;
    items: IProductOrderItem[];
    amount: number;
}

const PlaceOrder = () => {
    const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.Cod);
    const { products } = useProductsStore();
    const { token } = userPersistStore();
    const { cartItems, setCartItems, delivery_fee } = useCartStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IOrderForm>({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    });

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof IOrderForm;
        const value = event.target.value;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const orderItems: IProductOrderItem[] = [];

            for (const id in cartItems) {
                for (const item in cartItems[id]) {
                    if (cartItems[id][item] > 0) {
                        const itemInfo = structuredClone(
                            products.find((product) => product._id === id)
                        );
                        if (itemInfo) {
                            const productOrderItem: IProductOrderItem = {
                                ...itemInfo,
                                size: item,
                                quantity: cartItems[id][item],
                            };
                            orderItems.push(productOrderItem);
                        }
                    }
                }
            }

            const orderData: IOrderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount(products, cartItems) + delivery_fee,
            };

            switch (method) {
                // API Calls for COD
                case PaymentMethod.Cod: {
                    const response = await apiPlaceOrder(token, orderData);
                    if (response.data.success) {
                        setCartItems({});
                        navigate("/orders");
                    } else {
                        toast.error(response.data.message);
                    }
                    break;
                }

                case PaymentMethod.Stripe: {
                    const responseStripe = await apiStripePayment(
                        token,
                        orderData
                    );
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                    }
                    break;
                }

                default:
                    break;
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
        >
            {/* ------------- Left Side Delivery Info ------------------*/}
            <section className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={"DELIVERY"} text2={"INFORMATION"} />
                </div>

                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="First name"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="Last name"
                    />
                </div>
                <input
                    required
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="email"
                    placeholder="Email address"
                />
                <input
                    required
                    onChange={onChangeHandler}
                    name="street"
                    value={formData.street}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="text"
                    placeholder="Street"
                />
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="City"
                    />
                    <input
                        onChange={onChangeHandler}
                        name="state"
                        value={formData.state}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="State"
                    />
                </div>
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="zipcode"
                        value={formData.zipcode}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="number"
                        placeholder="Zipcode"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="country"
                        value={formData.country}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="Country"
                    />
                </div>
                <input
                    required
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="number"
                    placeholder="Phone"
                />
            </section>
            {/* ------------- Left Side Delivery Info ------------------*/}

            {/* ----------- Right Side Cart Total & Payment ------------*/}
            <section className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>

                <div className="mt-12">
                    <Title text1="PAYMENT" text2="METHOD" />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div
                            onClick={() => setMethod(PaymentMethod.Stripe)}
                            className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
                        >
                            <p
                                className={cn(
                                    "min-w-3.5 h-3.5 border rounded-full ",
                                    `${
                                        method === PaymentMethod.Stripe
                                            ? "bg-green-400"
                                            : ""
                                    }`
                                )}
                            ></p>
                            <img
                                className="h-5 mx-4"
                                src={assets.stripe_logo}
                                alt=""
                            />
                        </div>
                        <div
                            onClick={() => setMethod(PaymentMethod.Cod)}
                            className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
                        >
                            <p
                                className={cn(
                                    "min-w-3.5 h-3.5 border rounded-full ",
                                    `${
                                        method === PaymentMethod.Cod
                                            ? "bg-green-400"
                                            : ""
                                    }`
                                )}
                            ></p>
                            <p className=" text-gray-500 text-sm font-medium mx-4">
                                CASH ON DELIVERY
                            </p>
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button
                            type="submit"
                            className="bg-black text-white px-16 py-3 text-sm"
                        >
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </section>
        </form>
    );
};

export default PlaceOrder;
