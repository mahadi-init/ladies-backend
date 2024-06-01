import { Request, Response } from "express";
import mongoose from "mongoose";
import { nodemailerImpl } from "../utils/nodemailer-impl";
import { BaseRequest } from "./BaseRequest";

export class SharedRequest extends BaseRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getActiveData = async (_: Request, res: Response) => {
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

  getTotalPages = async (_: Request, res: Response) => {
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

  pagination = async (req: Request, res: Response) => {
    try {
      const page = req.query.page;
      const limit = req.query.limit;

      if (typeof page !== "string" || typeof limit !== "string")
        throw new Error("page and limit must be numbers");

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const result = await this.model.find().skip(skip).limit(parseInt(limit));

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

  search = async (req: Request, res: Response) => {
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

  changeStatus = async (req: Request, res: Response) => {
    try {
      const data = await this.model.findById(req.params.id);

      if (!data) {
        throw new Error("Data not found");
      }

      data.status = !data.status;
      await data.save();

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    try {
      const result = await this.model.findOne({ email: req.body.email });

      // create 4 random token
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      if (!result) {
        throw new Error("User not found");
      }

      result.forgetPasswordToken = token;
      await result.save();

      await nodemailerImpl(
        result.email,
        "Password Recovery",
        undefined,
        `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://github.com/Nahidakanda/LadiesSign/blob/main/LadiesSignBkash.png?raw=true" alt="LadiesSign" style="max-width: 100%; height: auto;" />
          </div>
          <h1 style="color: #444;">Reset Your Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the following token to reset it:</p>
          <p style="font-size: 18px; font-weight: bold; color: #555;">${token}</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,<br/>The LadiesSign Team</p>
        </div>
        `
      );

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

  resetTokenLogin = async (req: Request, res: Response) => {
    try {
      const result = await this.model.findOne({
        forgetPasswordToken: req.body.token,
      });

      if (!result) {
        throw new Error("Wrong token");
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
}
