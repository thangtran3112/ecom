import Product from "../models/Product";
import ProductStat from "../models/ProductStat";
import { Request, Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";
import validator from "validator";
import { getCountryISO3 } from "ts-country-iso-2-to-3";

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

export const getGeography = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc: any, { country }) => {
      // console.log(getCountryISO3('br')) // BRA
      // console.log(getCountryISO3('US')) // USA
      const countryISO3 = getCountryISO3(country as string);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++; // keep track of the number of users in this country as a key
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        // in-order for nunivo frontend library to work with geography, we need countryISO3 codes
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
