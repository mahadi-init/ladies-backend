import { Request, Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { generateToken } from "../utils/token";

export class AdminRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

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

  login = async (req: Request, res: Response) => {
    try {
      const data = await this.model.findOne({ phone: req.body.phone });

      if (data && req.body.password === data.password) {
        if (!data.status) {
          throw new Error("Inactive account");
        }

        const token = generateToken({
          id: data._id,
          name: data.name,
          status: data.status,
          role: data.role,
        });

        return res.status(200).json({
          success: true,
          data: data,
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
}
