/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useEffect, useState } from "react";
import { Product } from "../interfaces/Product";
import { toast } from "react-toastify";
import { NavigateFunction, useNavigate } from "react-router-dom";
import axios from "axios";

/** Example of the cartItems object
  {
    "product1": {
      "small": 2,
      "medium": 1,
      "large": 0
    },
    "product2": {
      "small": 0,
      "medium": 3,
      "large": 1
    }
  }
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
  cartItems: CartItemsProps;
  setCartItems: React.Dispatch<React.SetStateAction<CartItemsProps>>;
  addToCart: (itemId: string, size: string) => Promise<void>;
  getCartCount: () => number;
  updateQuantity: (
    itemId: string,
    size: string,
    quantity: number
  ) => Promise<void>;
  getCartAmount: () => number;
  navigate: NavigateFunction;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  token: string;
  backendUrl: string;
}

export const ShopContext = createContext<ShopContextProps>(
  {} as ShopContextProps
);

const ShopContextProvider = (props: any) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string>("");

  //this could be replaced by using local storage, or with Zustand Persist
  const [cartItems, setCartItems] = useState<CartItemsProps>({});

  const addToCart = async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (
    itemId: string,
    size: string,
    quantity: number
  ) => {
    const cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    }
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

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token: string) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token") as string);
      getUserCart(localStorage.getItem("token") as string);
    }
    if (token) {
      getUserCart(token);
    }
  }, [token]);

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
    setToken,
    token,
    backendUrl,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
