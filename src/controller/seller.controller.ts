import { Request, Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Order } from "../model/order.model";
import { generateToken } from "../utils/token";

export class SellerRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getAllData = async (_: Request, res: Response) => {
    try {
      // show false approve fast
      const data = await this.model.find().sort({ approved: -1 });

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

  search = async (req: Request, res: Response) => {
    try {
      const q = req.query.q;

      const result = await this.model.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { cid: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
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

  login = async (req: Request, res: Response) => {
    try {
      const seller = await this.model.findOne({ phone: req.body.phone });

      if (seller && req.body.password === seller.password) {
        if (!seller.status) {
          throw new Error("Inactive account");
        }

        const token = generateToken({
          id: seller._id,
          name: seller.name,
          status: seller.status,
          role: "seller",
        });

        return res.status(200).json({
          success: true,
          data: seller,
          token: token,
        });
      }

      res.status(400).json({
        success: false,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const result = await this.model.findByIdAndUpdate(req.params.id, {
        password: req.body.password,
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

  orderPagination = async (req: Request, res: Response) => {
    try {
      const page = req.query.page;
      const limit = req.query.limit;

      if (typeof page !== "string" || typeof limit !== "string")
        throw new Error("page and limit must be numbers");

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const result = await Order.find({ _id: req.params.id })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

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

  getOrderTotalPages = async (req: Request, res: Response) => {
    try {
      const result = await Order.find({
        _id: req.params.id,
      }).estimatedDocumentCount();
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

  approveSeller = async (req: Request, res: Response) => {
    try {
      await this.model.findByIdAndUpdate(req.params.id, {
        approved: true,
        status: true,
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

  orderSearch = async (req: Request, res: Response) => {
    try {
      const q = req.query.q;

      const result = await Order.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { invoice: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
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
}
