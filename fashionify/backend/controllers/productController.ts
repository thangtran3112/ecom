import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { IProduct } from "../models/productModel";
import ProductModel from "../models/productModel";
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

    const images = [image1, image2, image3, image4].filter(Boolean);

    //upload images to cloudinary, from the images local storage
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "fashionify",
        });
        return result.secure_url;
      })
    );

    const productData: IProduct = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new ProductModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json({ success: true, products });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req: Request, res: Response) => {
  try {
    await ProductModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Deleted" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const product = await ProductModel.findById(productId);
    res.json({ success: true, product });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
