import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Request, Response } from "express";

export class UserRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  login = async (req: Request, res: Response) => {
    try {
      const user = await this.model.findOne({ phone: req.body.phone });

      if (user && req.body.password === user.password) {
        return res.status(200).json({
          success: true,
          data: user,
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
