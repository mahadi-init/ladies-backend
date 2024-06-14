import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Review } from "../model/review.model";
import { ExtendedRequest } from "../types/extended-request";

export class ProductRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getAllData = async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await this.model.find({})

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

  getSingleData = async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await this.model.findById(req.params.id)

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

  getSearchData = async (req: ExtendedRequest, res: Response) => {
    try {
      const q = req.query.q;

      const result = await this.model.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { cid: { $regex: q, $options: "i" } },
          { sku: { $regex: q, $options: "i" } },
        ],
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

  getReviewProduct = async (_: ExtendedRequest, res: Response) => {
    try {
      const result = await this.model.find({})

      const products = result.filter((p) => p.reviews.length > 0);

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  getPopularProducts = async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await this.model
        .find({ productType: req.params.type })
        .limit(8)

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  findProducts = async (req: ExtendedRequest, res: Response) => {
    try {
      let products;

      if (req.query.new === "true") {
        products = await this.model
          .find()
          .sort({ createdAt: -1 })
          .limit(8)
      } else if (req.query.featured === "true") {
        products = await this.model
          .find({
            featured: true,
          })
      } else if (req.query.topSellers === "true") {
        products = await this.model
          .find()
          .sort({ sellCount: -1 })
          .limit(8)
      } else {
        products = await this.model
          .find()
          .sort({ createdAt: -1 })
      }

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  getRelatedProducts = async (req: ExtendedRequest, res: Response) => {
    try {
      //IMPLEMENT
      const currentProduct = await this.model.findById(req.params.id);

      const result = await this.model.find({
        _id: { $ne: req.params.id },
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  getStockoutProducts = async (_: ExtendedRequest, res: Response) => {
    try {
      const result = await this.model.find({ status: "OUT-OF-STOCK" }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        sucess: false,
        message: error.message,
      });
    }
  };
}
