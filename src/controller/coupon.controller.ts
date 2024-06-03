import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";

export class CouponRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  search = async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await this.model.find({
        title: { $regex: req.query.q, $options: "i" },
      });

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
