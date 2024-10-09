import Product from "../models/Product";
import ProductStat from "../models/ProductStat";
import { Request, Response } from "express";
import User from "../models/User";

export const getProducts = async (req: Request, res: Response) => {
  try {
    //may use lean() to avoid product results are concatenated into ._doc
    const products = await Product.find().lean();

    //this can be rewritten by Mongo Aggregate function, to Join Products and ProductStat tables
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        //do not use find() as it return an array, while we know there is only 1 element
        const stat = await ProductStat.findOne({
          productId: product._id,
        });
        // const productDoc = product._doc || product;
        return {
          ...product,
          stat,
        };
      })
    );
    res.status(200).json(productsWithStats);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
