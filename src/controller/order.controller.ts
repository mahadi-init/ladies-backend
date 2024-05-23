import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { Request, Response } from "express";
import secrets from "../config/secret";

export class OrderRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  pagination = async (req: Request, res: Response) => {
    try {
      const page = req.query.page;
      const limit = req.query.limit;

      if (typeof page !== "string" || typeof limit !== "string")
        throw new Error("page and limit must be numbers");

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const result = await this.model
        .find()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

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
        invoice: { $regex: req.query.q, $options: "i" },
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

      await this.model.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });

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

  sendOrder = async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const courirData = {
        invoice: body.invoice,
        recipient_name: body.name,
        recipient_phone: body.contact,
        recipient_address: `${body.address} ${body.city}`,
        cod_amount: Number(body.shippingCost),
        orderNote: body.note,
      };

      const data = await fetch(
        `${secrets.STEADFAST_BASE_URL}/api/v1/create_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": secrets.STEADFAST_API_KEY,
            "Secret-Key": secrets.STEADFAST_SECRECT_KEY,
          },
          body: JSON.stringify(courirData),
        },
      );

      const orderData = await data.json();

      if (orderData) {
        // UPDATE DATABASE STATUS
      }

      throw new Error();
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
}
