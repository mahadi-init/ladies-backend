import { Request, Response } from "express";
import { SharedRequest } from "../helpers/SharedRequest";
import mongoose from "mongoose";
import { Transaction } from "../model/transaction.model";
import { Withdraw } from "../model/withdraw.model";

export class SellerRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getStatus = async (req: Request, res: Response) => {
    try {
      const data = await this.model.findById(req.params.id, { status: 1 });

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

  getAllTransactions = async (req: Request, res: Response) => {
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

  getLastWithdraw = async (req: Request, res: Response) => {
    try {
      const data = await Withdraw.findOne({ seller: req.params.id })
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

  getAllWithdraws = async (req: Request, res: Response) => {
    try {
      const data = await Withdraw.find({ seller: req.params.id });

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

  createWithdrawRequest = async (req: Request, res: Response) => {
    try {
      const data = await Withdraw.create(req.body);

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
