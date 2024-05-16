import { Request, Response } from "express";
import { SharedRequest } from "../helpers/SharedRequest";
import mongoose from "mongoose";

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
}
