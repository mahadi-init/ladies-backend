import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Transaction } from "../model/transaction.model";
import { ExtendedRequest } from "../types/extended-request";

export class TransactionRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getLastTransaction = async (req: ExtendedRequest, res: Response) => {
    try {
      const id = req.id

      if (!id && req.role !== "SELLER") {
        throw new Error("Unauthorized")
      }

      const data = await Transaction.findOne({ person: id })
        .sort({
          createdAt: -1,
        })
        .limit(1);

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllTransactionsByID = async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await Transaction.find({ person: req.params.id });

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
