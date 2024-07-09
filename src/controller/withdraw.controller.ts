import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";

export class WithdrawRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getLastWithdraw = async (req: ExtendedRequest, res: Response) => {
    try {
      const id = req.id;

      const data = await this.model.findOne({ seller: id }).sort({
        createdAt: -1,
      });

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

  getAllWithdraws = async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await this.model.find({ seller: req.params.id });

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

  changeStatus = async (req: ExtendedRequest, res: Response) => {
    try {
      await this.model.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  };

  pagination = async (req: ExtendedRequest, res: Response) => {
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
        result = await this.model
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      }

      // filter by default
      if (filterBy === "status") {
        if (status === "ALL") {
          result = await this.model
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        } else {
          result = await this.model
            .find({ status: status })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        }
      }

      // filter by search
      if (filterBy === "search") {
        result = await this.model
          .find({
            $or: [
              { invoice: { $regex: search, $options: "i" } },
              { name: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } },
            ],
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
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
}
