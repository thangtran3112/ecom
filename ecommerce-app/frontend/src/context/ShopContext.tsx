/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import { products } from "../assets/assets";
import { Product } from "../interfaces/Product";

interface ShopContextProps {
  products: Product[];
  currency: string;
  delivery_fee: number;
}

export const ShopContext = createContext<ShopContextProps>(
  {} as ShopContextProps
);

const ShopContextProvider = (props: any) => {
  const currency = "$";
  const delivery_fee = 10;

  const value = {
    products,
    currency,
    delivery_fee,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
