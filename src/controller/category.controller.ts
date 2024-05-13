import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Request, Response } from "express";

export class CategoryRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  showTypes = async (req: Request, res: Response) => {
    try {
      const result = await this.model.find({ productType: req.params.type });

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
