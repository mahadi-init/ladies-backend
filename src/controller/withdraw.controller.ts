import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Request, Response } from "express";

export class WithdrawRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getLastWithdraw = async (req: Request, res: Response) => {
    try {
      const data = await this.model
        .findOne({ seller: req.params.id, status: true })
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
      const data = await this.model.find({ seller: req.params.id });

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
