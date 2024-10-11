import Product from "../models/Product";
import ProductStat from "../models/ProductStat";
import { Request, Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";
import validator from "validator";

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

function validateAndSanitizeInput(search: unknown): string {
  if (typeof search !== "string") {
    return "";
  }

  // Remove any potentially harmful characters
  const sanitized = validator.escape(search);

  // Limit the length of the search string
  const truncated = sanitized.slice(0, 100);

  // Ensure the search string only contains alphanumeric characters and spaces
  if (!validator.isAlphanumeric(truncated, "en-US", { ignore: " " })) {
    return "";
  }

  return truncated;
}

/**
 * Server-side pagination
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
    const sanitizedSearch = validateAndSanitizeInput(search as string);

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort as string);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };
      return sortFormatted;
    };

    const sortFormatted = Boolean(sort) ? generateSort() : {};
    const skipNumber = (page as number) * (pageSize as number);

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(sanitizedSearch, "i") } }, // "i" means searching case-insensitive
        { userId: { $regex: new RegExp(sanitizedSearch, "i") } }, // "i" means searching case-insensitive
      ],
    })
      .sort(sortFormatted as any)
      .skip(skipNumber)
      .limit(pageSize as number);

    const total = await Transaction.countDocuments({
      name: { $regex: sanitizedSearch, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
