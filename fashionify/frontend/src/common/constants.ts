// global variables
export const CURRENCY = "usd";
export const DELIVERY_CHARGE = 10;

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
