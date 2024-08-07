import { Response } from "express";
import mongoose from "mongoose";
import { ExtendedRequest } from "../types/extended-request";
import { generateToken } from "../utils/token";
import { BaseRequest } from "./BaseRequest";

export class SharedRequest extends BaseRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getActiveData = async (_: ExtendedRequest, res: Response) => {
    try {
      const result = await this.model.find({ status: true });

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

  getTotalPages = async (_: ExtendedRequest, res: Response) => {
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

  // pagination = async (req: ExtendedRequest, res: Response) => {
  //   try {
  //     const page = req.query.page;
  //     const limit = req.query.limit;

  //     if (typeof page !== "string" || typeof limit !== "string")
  //       throw new Error("page and limit must be numbers");

  //     const skip = (parseInt(page) - 1) * parseInt(limit);
  //     const result = await this.model.find().skip(skip).limit(parseInt(limit));

  //     // add transaction history with result
  //     let data = []
  //     result.map(async (res) => {
  //       const transaction = await Transaction.find({ phone: res.phone }).countDocuments()

  //       data.push({ ...res, transaction: transaction })
  //     })

  //     res.status(200).json({
  //       success: true,
  //       data: result,
  //     });
  //   } catch (error: any) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // };

  pagination = async (req: ExtendedRequest, res: Response) => {
    try {
      // query params
      const page = req.query.page;
      const limit = req.query.limit;
      let search = req.query.search;

      // filter by params
      const filterBy: "default" | "search" = req.query
        .filterBy as any;

      // check the types are number 
      if (typeof page !== "string" || typeof limit !== "string"){
        throw new Error("page and limit must be numbers");
      }

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
            { phone: { $regex: search, $options: "i" } },
          ],
        }).sort({ createdAt: -1 })
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

  search = async (req: ExtendedRequest, res: Response) => {
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

  login = async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await this.model.findOne({ phone: req.body.phone });

      if (!data) {
        return res.status(400).json({
          success: false,
          message: "No account found",
        });
      } else if (req.body.password === data.password) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }

      const token = generateToken({
        id: data._id,
        role: data.role ?? "USER",
      });

      res.status(200).json({
        success: true,
        data: data,
        token: token,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
