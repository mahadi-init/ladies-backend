import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Request, Response } from "express";

export class BrandRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  allNames = async (_: Request, res: Response) => {
    try {
      const result = await this.model.find({}).distinct("name");

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
