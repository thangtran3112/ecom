import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/User";

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
