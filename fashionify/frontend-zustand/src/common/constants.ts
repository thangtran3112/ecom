// global variables
export const CURRENCY = "usd";
export const DELIVERY_CHARGE = 10;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
export const ADMIN_DASHBOARD_URL = import.meta.env.VITE_ADMIN_FRONTEND_URL;

export enum PaymentMethod {
  Stripe = "Stripe",
  Cod = "COD",
}

export enum OrderStatus {
  OrderPlaced = "Order Placed",
  Packing = "Packing",
  Processing = "Processing",
  Shipped = "Shipped",
  OutForDelivery = "Out for delivery",
  Delivered = "Delivered",
}
