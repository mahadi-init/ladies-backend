import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
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

  getPaginatedProducts = async (req: ExtendedRequest, res: Response) => {
    try {
      // query params
      const page = req.query.page;
      const limit = req.query.limit;
      let search = req.query.search;
      let status = req.query.status;

      // filter by params
      const filterBy: "default" | "search" | "status" = req.query
        .filterBy as any;

      // check the types are number 
      if (typeof page !== "string" || typeof limit !== "string")
        throw new Error("page and limit must be numbers");

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // empty array initialization
      let result: any = [];

      // filter by default
      if (filterBy === "default") {
        result = await this.model.find().sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      }

      // filter by search
      if (filterBy === "search") {
        result = await this.model.find({
          $or: [
            { invoice: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } },
          ],
        }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      }

      // filter by status
      if (filterBy === "status") {
        if (status === "ALL") {
          result = await this.model.find({}).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
        } else {
          result = await this.model.find({
            status: status,
          }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        }
      }

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

  search = async (req: ExtendedRequest, res: Response) => {
    const q = req.query.q;

    try {
      const result = await this.model.find({
        $or: [
          { invoice: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
          { name: { $regex: q, $options: "i" } },
          { address: { $regex: q, $options: "i" } },
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
