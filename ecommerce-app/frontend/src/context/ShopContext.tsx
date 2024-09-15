/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { Product } from "../interfaces/Product";
import { toast } from "react-toastify";

/**
 * CartItems will look like this:
 * {
 *    "product_id": {
 *    "size": quantity
 * }
 */
interface CartItemsProps {
  [key: string]: {
    [key: string]: number;
  };
}

interface ShopContextProps {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: any;
  // eslint-disable-next-line no-unused-vars
  addToCart: (itemId: string, size: string) => Promise<void>;
  getCartCount: () => number;
}

export const ShopContext = createContext<ShopContextProps>(
  {} as ShopContextProps
);

const ShopContextProvider = (props: any) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(true);

  //this could be replaced by using local storage, or with Zustand Persist
  const [cartItems, setCartItems] = useState<CartItemsProps>({});

  const addToCart = async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Select product size");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        //when item already exists in cart
        cartData[itemId][size] += 1;
      } else {
        //create new entry
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  const value: ShopContextProps = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
