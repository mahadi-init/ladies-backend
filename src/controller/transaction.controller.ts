import { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction } from "../model/transaction.model";
import { SharedRequest } from "../helpers/SharedRequest";

export class TransactionRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getLastTransaction = async (req: Request, res: Response) => {
    try {
      const data = await Transaction.findOne({ person: req.params.id })
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

  getAllTransactionsByID = async (req: Request, res: Response) => {
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
