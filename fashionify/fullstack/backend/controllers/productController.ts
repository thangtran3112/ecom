import { Request, Response } from "express";

/**
 * req: Request object after modifying by multer middleware
 * */
const addProduct = async (req: any, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req?.files?.image1 && req.files.image1[0];
    const image2 = req?.files?.image2 && req.files.image2[0];
    const image3 = req?.files?.image3 && req.files.image3[0];
    const image4 = req?.files?.image4 && req.files.image4[0];

    console.log(
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller
    );
    console.log(image1, image2, image3, image4);
    res.json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listProducts = async (req: Request, res: Response) => {};

const removeProduct = async (req: Request, res: Response) => {};

// function for single product info
const singleProduct = async (req: Request, res: Response) => {};

export { listProducts, addProduct, removeProduct, singleProduct };
