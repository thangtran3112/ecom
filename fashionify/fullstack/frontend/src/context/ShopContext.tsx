/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { Product } from "../interfaces/Product";
import { toast } from "react-toastify";
import { NavigateFunction, useNavigate } from "react-router-dom";

/**
 * CartItems will look like this:
 * {
 *    "product_id": {
 *    "size": quantity
 * }
 * size can be S, M, L, XL
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
  addToCart: (itemId: string, size: string) => Promise<void>;
  getCartCount: () => number;
  updateQuantity: (
    itemId: string,
    size: string,
    quantity: number
  ) => Promise<void>;
  getCartAmount: () => number;
  navigate: NavigateFunction;
}

export const ShopContext = createContext<ShopContextProps>(
  {} as ShopContextProps
);

const ShopContextProvider = (props: any) => {
  const currency = "$";
  const delivery_fee = 10;
  const navigate = useNavigate();
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

  const updateQuantity = async (
    itemId: string,
    size: string,
    quantity: number
  ) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItems) {
      for (const productSize in cartItems[productId]) {
        try {
          if (cartItems[productId][productSize] > 0) {
            totalCount += cartItems[productId][productSize];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const productId in cartItems) {
      const itemInfo = products.find((product) => product._id === productId);

      if (!itemInfo) {
        toast.error(`Unknown Error, Product not found for ${productId}`);
        continue;
      }

      for (const productSize in cartItems[productId]) {
        try {
          if (cartItems[productId][productSize] > 0) {
            totalAmount += itemInfo.price * cartItems[productId][productSize];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalAmount;
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
    updateQuantity,
    getCartAmount,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
