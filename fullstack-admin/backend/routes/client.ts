import express from "express";
import { getCustomers, getProducts } from "../controllers/client";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);

export default router;
