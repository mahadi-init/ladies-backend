import { Request, Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { generateToken } from "../utils/token";

export class UserRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

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
}
