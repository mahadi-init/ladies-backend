import { Request, Response } from "express";
import { Admin } from "../model/admin.model";
import { Seller } from "../model/seller.model";
import { generateToken } from "../utils/token";
import { nodemailerImpl } from "../utils/nodemailer-impl";

export class AuthRequest {

  login = async (req: Request, res: Response) => {
    try {
      const role = req.query.role as string

      let data = null
      let token = null

      if (role === "seller") {
        data = await Seller.findOne({ phone: req.body.phone });

        if (!data) {
          return res.status(400).json({
            success: false,
            message: "একাউন্ট পাওয়া যাই নি",
          });
        }
        if (req.body.password !== data.password) {
          return res.status(400).json({
            success: false,
            message: "পাসওয়ার্ড ভুল হয়েছে",
          });
        }
      } else {
        data = await Admin.findOne({ phone: req.body.phone });

        if (!data) {
          return res.status(400).json({
            success: false,
            message: "No account found",
          });
        }
        if (req.body.password !== data.password) {
          return res.status(400).json({
            success: false,
            message: "Incorrect password",
          });
        }
      }

      token = generateToken({
        id: data._id.toString(),
        role: role.toUpperCase(),
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

  forgetPassword = async (req: Request, res: Response) => {
    try {
      const role = req.query.role
      let data = null

      if (role === "seller") {
        data = await Seller.findOne({ email: req.body.email });
      } else {
        data = await Admin.findOne({ email: req.body.email });
      }

      if (!data || !data.email) {
        throw new Error("User not found");
      }

      await nodemailerImpl(
        [data.email],
        "Password Recovery",
        undefined,
        `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://github.com/Nahidakanda/LadiesSign/blob/main/LadiesSignBkash.png?raw=true" alt="LadiesSign" style="max-width: 100%; height: auto;" />
          </div>
          <h1 style="color: #444;">Reset Your Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Your login password is:</p>
          <p style="font-size: 18px; font-weight: bold; color: #555;">${data.password}</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,<br/>The LadiesSign Team</p>
        </div>
        `,
      );

      res.status(200).json({
        success: true,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
}