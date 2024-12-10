import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb";
import connectCloudinary from "./config/cloudinary";
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import cartRouter from "./routes/cartRoute";

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
// parse application/json
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/** This optional, only needed for wrapping in AWS Lambda Handler */
export default app;
