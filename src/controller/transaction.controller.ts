import { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction } from "../model/transaction.model";

export class TransactionRequest {
  model: typeof mongoose.Model;

  constructor(model: typeof mongoose.Model) {
    this.model = model;
  }

  getWithdrawDepositeData = async (req: Request, res: Response) => {
    try {
      const data = await Transaction.findOne({ person: req.params.id });

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

  getLastWithdrawData = async (req: Request, res: Response) => {
    try {
      const result = await this.model
        .findOne({ seller: req.params.id })
        .where("withdraw")
        .gt(0)
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getLastDepositeData = async (req: Request, res: Response) => {
    try {
      const result = await this.model
        .findOne({ seller: req.params.id })
        .where("deposit")
        .gt(0)
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
