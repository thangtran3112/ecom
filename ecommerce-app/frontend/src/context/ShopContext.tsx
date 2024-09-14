/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";
import { products } from "../assets/assets";
import { Product } from "../interfaces/Product";

interface ShopContextProps {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShopContext = createContext<ShopContextProps>(
  {} as ShopContextProps
);

const ShopContextProvider = (props: any) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(true);

  const value: ShopContextProps = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
