import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
} from "../controllers/productController";
import upload from "../middleware/multer";
import { adminAuth } from "../middleware/adminAuth";

const productRouter = express.Router();

// We will handle at most 4 images for a product
const productUploadMulter = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

productRouter.post("/add", adminAuth, productUploadMulter, addProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);

export default productRouter;
