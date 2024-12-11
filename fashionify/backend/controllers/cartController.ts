import { Request, Response } from "express";
import userModel from "../models/userModel";

/*
 * userId is attached through authUser middleware, it is authortative and safe
 */
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, itemId, size } = req.body;

    if (!size) {
      return res.json({ success: false, message: "Must Select product size" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = (await userData.cartData) || {};

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

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/*
 * userId is attached through authUser middleware, it is authortative and safe
 */
export const updateCart = async (req: Request, res: Response) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (!cartData[itemId]) {
      return res.json({ success: false, message: "Item not found in cart" });
    }

    // in case of update quantity to 0, remove the item from cart
    if (quantity === 0) {
      delete cartData[itemId][size];
      //if we delete all sizes of an item, remove the item from cart
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/*
 * userId is attached through authUser middleware, it is authortative and safe
 */
export const getUserCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
