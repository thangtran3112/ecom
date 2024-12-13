export const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
export const SHOP_URL = import.meta.env.VITE_SHOP_URL;
export const TOKEN = "token";
export enum Sizes {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export enum Categories {
  Men = "Men",
  Women = "Women",
  Kids = "Kids",
}

export enum SubCategories {
  Topwear = "Topwear",
  Bottomwear = "Bottomwear",
  Winterwear = "Winterwear",
}

export const CURRENCY = "$";

export enum OrderStatus {
  OrderPlaced = "Order Placed",
  Packing = "Packing",
  Processing = "Processing",
  Shipped = "Shipped",
  OutForDelivery = "Out for delivery",
  Delivered = "Delivered",
}
