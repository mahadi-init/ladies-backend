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
      const user = await this.model.findOne({ phone: req.body.phone });

      if (user && req.body.password === user.password) {
        if (!user.status) {
          throw new Error("Inactive account");
        }

        const token = generateToken({
          id: user._id,
          name: user.name,
          status: user.status,
          role: "user",
        });

        return res.status(200).json({
          success: true,
          data: user,
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
