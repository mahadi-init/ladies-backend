import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";

export class WithdrawRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getLastWithdraw = async (req: ExtendedRequest, res: Response) => {
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

  getAllWithdraws = async (req: ExtendedRequest, res: Response) => {
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
