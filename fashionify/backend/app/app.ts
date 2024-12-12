import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "../routes/userRoute";
import productRouter from "../routes/productRoute";
import cartRouter from "../routes/cartRoute";
import orderRouter from "../routes/orderRoute";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "../config/mongodb";
import connectCloudinary from "../config/cloudinary";

//put these connections outside of Lambda handler to reuse database connection
connectDB();
connectCloudinary();

// App Config
const app = express();

// Middlewares
// parse application/json
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

export default app;
