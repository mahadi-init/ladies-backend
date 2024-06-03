import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";

export class ReviewRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getAllData = async (_: ExtendedRequest, res: Response) => {
    try {
      const reviews = await this.model
        .find({})
        .sort({ rating: -1 })
        .populate({
          path: "productId",
          select: "title img",
        })
        .populate("userId", "name email");

      const reviewData = reviews.map((review) => {
        if (!review.productId || !review.userId) {
          return null;
        }

        return {
          _id: review._id,
          userId: review.userId._id,
          // @ts-ignore
          userName: review.userId.name,
          // @ts-ignore
          userEmail: review.userId.email,
          productId: review.productId._id,
          // @ts-ignore
          product: review.productId.title,
          // @ts-ignore
          productImage: review.productId.img,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        };
      });

      // Filter out null values
      const result = reviewData.filter((review) => review !== null);

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

  getReviewsByProductId = async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await this.model.find({ productId: req.params.id });

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
}
