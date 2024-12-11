import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { TokenProps } from "../types/Token";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL, CURRENCY, OrderStatus } from "../common/constants";
import { IOrder } from "../types/Order";
import { assets } from "../assets/assets";

/**
 * @todo: We need to implement Orders Pagination and Filtering
 */
const Orders = ({ token }: TokenProps) => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const fetchAllOrders = useCallback(async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        BACKEND_URL + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const statusHandler = useCallback(
    async (event: ChangeEvent<HTMLSelectElement>, orderId: string) => {
      try {
        const response = await axios.post(
          BACKEND_URL + "/api/order/status",
          { orderId, status: event.target.value },
          { headers: { token } }
        );
        if (response.data.success) {
          await fetchAllOrders();
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
    []
  );

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p className="py-0.5" key={index}>
                        {" "}
                        {item.name} x {item.quantity} <span> {item.size} </span>{" "}
                      </p>
                    );
                  } else {
                    return (
                      <p className="py-0.5" key={index}>
                        {" "}
                        {item.name} x {item.quantity} <span> {item.size} </span>{" "}
                        ,
                      </p>
                    );
                  }
                })}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {CURRENCY}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value={OrderStatus.OrderPlaced}>
                {OrderStatus.OrderPlaced}
              </option>
              <option value={OrderStatus.Packing}>{OrderStatus.Packing}</option>
              <option value={OrderStatus.Shipped}>{OrderStatus.Shipped}</option>
              <option value={OrderStatus.OutForDelivery}>
                {OrderStatus.OutForDelivery}
              </option>
              <option value={OrderStatus.Delivered}>
                {OrderStatus.Delivered}
              </option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
