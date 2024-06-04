import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";
import { Product } from "../model/product.model";

export class ReviewRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getAllData = async (_: ExtendedRequest, res: Response) => {
    try {
      const reviews = await this.model.find({}).sort({ rating: -1 }).populate({
        path: "product",
        select: "_id name img",
        model: Product,
      });

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getReviewsByProductId = async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await this.model.find({ product: req.params.id });

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  approveReview = async (req: ExtendedRequest, res: Response) => {
    try {
      await this.model.findByIdAndUpdate(req.params.id, {
        approved: true,
      });

      res.status(200).json({
        success: true,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
}
