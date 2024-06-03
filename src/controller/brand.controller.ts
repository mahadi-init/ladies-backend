import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";

export class BrandRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  allNames = async (_: ExtendedRequest, res: Response) => {
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
