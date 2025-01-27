import { useEffect, useState } from "react";
import Title from "../components/Title";
import { IOrder, OrderProductItem } from "../interfaces/Order";
import useCartStore from "../stores/cartStore";
import { apiGetUserOrders } from "../api/orderApis";
import userPersistStore from "../stores/persistStore";

const Orders = () => {
    const { token } = userPersistStore();
    const { currency } = useCartStore();
    const [orderData, setOrderData] = useState<OrderProductItem[]>([]);

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await apiGetUserOrders(token);
            if (response.data.success) {
                const allOrdersItem: OrderProductItem[] = [];
                const responseOrders = response.data.orders as IOrder[];
                responseOrders.map((order) => {
                    order.items.map((item) => {
                        const orderItem: OrderProductItem = {
                            ...item,
                            status: order.status,
                            payment: order.payment,
                            paymentMethod: order.paymentMethod,
                            date: order.date,
                        };
                        allOrdersItem.push(orderItem);
                    });
                });
                setOrderData(allOrdersItem.reverse());
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadOrderData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="border-t pt-16">
            <div className="text-2xl">
                <Title text1={"MY"} text2={"ORDERS"} />
            </div>

            <section>
                {orderData.map((item, index) => (
                    <div
                        key={index}
                        className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div className="flex items-start gap-6 text-sm">
                            <img
                                className="w-16 sm:w-20"
                                src={item.image[0]}
                                alt=""
                            />
                            <div>
                                <p className="sm:text-base font-medium">
                                    {item.name}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                                    <p>
                                        {currency}
                                        {item.price}
                                    </p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Size: {item.size}</p>
                                </div>
                                <p className="mt-1">
                                    Date:{" "}
                                    <span className=" text-gray-400">
                                        {new Date(item.date).toDateString()}
                                    </span>
                                </p>
                                <p className="mt-1">
                                    Payment:{" "}
                                    <span className=" text-gray-400">
                                        {item.paymentMethod}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-between">
                            <div className="flex items-center gap-2">
                                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                <p className="text-sm md:text-base">
                                    {item.status}
                                </p>
                            </div>
                            <button
                                onClick={loadOrderData}
                                className="border px-4 py-2 text-sm font-medium rounded-sm"
                            >
                                Track Order
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Orders;
