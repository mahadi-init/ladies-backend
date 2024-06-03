import { Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";

export class AdminRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getStatus = async (req: ExtendedRequest, res: Response) => {
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

  search = async (req: ExtendedRequest, res: Response) => {
    try {
      const q = req.query.q;

      const result = await this.model.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
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

  changePassword = async (req: ExtendedRequest, res: Response) => {
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
}
