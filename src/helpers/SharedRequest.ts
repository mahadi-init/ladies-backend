import mongoose from "mongoose";
import { BaseRequest } from "./BaseRequest";
import { Request, Response } from "express";

export class SharedRequest extends BaseRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getTotalPages = async (_: Request, res: Response) => {
    try {
      const result = await this.model.estimatedDocumentCount();
      const numOfPages = Math.ceil(result / 10);

      res.status(200).json({
        success: true,
        data: numOfPages,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  pagination = async (req: Request, res: Response) => {
    try {
      const page = req.query.page;
      const limit = req.query.limit;

      if (typeof page !== "string" || typeof limit !== "string")
        throw new Error("page and limit must be numbers");

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const result = await this.model.find().skip(skip).limit(parseInt(limit));

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

  search = async (req: Request, res: Response) => {
    try {
      const result = await this.model.find({
        name: { $regex: req.query.q, $options: "i" },
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
