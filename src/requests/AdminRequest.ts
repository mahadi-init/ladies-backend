import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { generateToken } from "../utils/token";
import { Request, Response } from "express";

export class AdminRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  login = async (req: Request, res: Response) => {
    try {
      const admin = await this.model.findOne({ phone: req.body.phone });

      if (admin && req.body.password === admin.password) {
        return res.status(200).json({
          success: true,
          data: admin,
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

  search = async (req: Request, res: Response) => {
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
}
