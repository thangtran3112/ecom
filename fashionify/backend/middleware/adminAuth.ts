import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token = req.header("token");

    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );
    //Because, we signed the token with email+password in userController.ts
    if (
      token_decode !==
      process.env.ADMIN_EMAIL! + process.env.ADMIN_PASSWORD!
    ) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    next();
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
