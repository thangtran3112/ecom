import Product from "../models/Product";
import ProductStat from "../models/ProductStat";
import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  try {
    //may use lean() to avoid product results are concatenated into ._doc
    const products = await Product.find().lean();

    //this can be rewritten by Mongo Aggregate function, to Join Products and ProductStat tables
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
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
