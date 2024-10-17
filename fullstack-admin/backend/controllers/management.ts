import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

const affiliateTableName = "affiliatestats";

// https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/
export const getUserPerformance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: affiliateTableName, //table name
          localField: "_id", //_id of User table
          foreignField: "userId",
          as: "affiliateStats",
        },
      }, //{ _id, affiliateStats array}
      { $unwind: "$affiliateStats" }, //flatten the array
    ]);
    // console.log(userWithStats);
    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id: string) => {
        return Transaction.findById(id);
      })
    );
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });

    //return format:
    // {
    //   user: {
    //     _id, name, affiliateStats : [ {_id, userId, transactionId}]
    //   },
    // }
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
