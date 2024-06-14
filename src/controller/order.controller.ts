import { Request, Response } from "express";
import mongoose from "mongoose";
import secrets from "../config/secret";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";
import { Order } from "../model/order.model";
import { User } from "../model/user.model";

export class OrderRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getOrdersByPhone = async (req: ExtendedRequest, res: Response) => {
    try {
      const id = req.id
      const phone = req.query.phone
      let orders

      if (id) {
        orders = await this.model.find({ sellerID: id })
      } else {
        orders = await this.model.find({ phone: phone });
      }

      console.log(orders);


      let pendingOrder = 0
      let processingOrder = 0
      let completedOrder = 0
      let totalOrder = 0

      orders.map((item: any) => {
        switch (item.status) {
          case "PENDING":
            pendingOrder++
            break;
          case "DELIVERED":
            completedOrder++
            break;
          default:
            processingOrder++;
            break;
        }
      })

      totalOrder = pendingOrder + processingOrder + completedOrder

      const count = {
        pendingOrder,
        processingOrder,
        completedOrder,
        totalOrder
      }

      res.status(200).json({
        success: true,
        count: count,
        orders: orders
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  };

  pagination = async (req: ExtendedRequest, res: Response) => {
    try {
      const page = req.query.page;
      const limit = req.query.limit;

      if (typeof page !== "string" || typeof limit !== "string")
        throw new Error("page and limit must be numbers");

      // sort by status/ the status are pending show first
      const skip = (parseInt(page) - 1) * parseInt(limit);
      let result = await Order
        .find()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ status: 1 });

      result.map(async (r) => {
        const timeGap = Math.floor(
          (new Date().getTime() - (r.lastChecked ? new Date(r.lastChecked).getTime() : 0)) /
          1000 / 60
        );

        if (r.status !== "DELIVERED" && r.status !== "CANCELLED" && timeGap > 30) {
          const status = await fetch(
            `${secrets.STEADFAST_BASE_URL}/status_by_invoice/${r.invoice}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Api-Key": secrets.STEADFAST_API_KEY,
                "Secret-Key": secrets.STEADFAST_SECRECT_KEY,
              },
            },
          );

          if (status.ok) {
            const data = await status.json()

            if (data.status === 200) {
              r.status = data.delivery_status.toUpperCase()
            }
          }
          r.lastChecked = new Date()
          r.save()
        }
      })

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
    const q = req.query.q;

    try {
      const result = await this.model.find({
        $or: [
          { invoice: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
          { name: { $regex: q, $options: "i" } },
          { address: { $regex: q, $options: "i" } },
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

  getTotalPages = async (_: ExtendedRequest, res: Response) => {
    try {
      const result = await this.model.estimatedDocumentCount();
      const numOfPages = Math.ceil(result / 15);

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

  // changeStatus = async (req: ExtendedRequest, res: Response) => {
  //   try {
  //     const data = await this.model.findById(req.params.id);

  //     if (!data) {
  //       throw new Error("Data not found");
  //     }

  //     await this.model.findByIdAndUpdate(req.params.id, {
  //       status: req.body.status,
  //     });

  //     res.status(200).json({
  //       success: true,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error,
  //     });
  //   }
  // };

  addData = async (req: ExtendedRequest, res: Response) => {
    try {
      const id = req.id
      let data

      if (id) {
        data = await Order.create({ ...req.body, sellerID: id });
      } else {
        data = await Order.create({ ...req.body });

        // save user info and create user
        const { name, phone, address } = req.body
        User.create({ name: name, phone: phone, address: address })
      }

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

  sendOrder = async (req: ExtendedRequest, res: Response) => {
    try {
      const body = req.body;

      const courirData = {
        invoice: body.invoice,
        recipient_name: body.name,
        recipient_phone: body.phone,
        recipient_address: body.address,
        cod_amount: Number(body.total),
        orderNote: body.note,
      };

      const courirResponse = await fetch(
        `${secrets.STEADFAST_BASE_URL}/create_order`,
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

      const orderData = await courirResponse.json();
      const order = await Order.findOne({ invoice: body.invoice })

      if (order) {
        if (orderData.consignment.tracking_code) {
          order.trackingLink = `https://steadfast.com.bd/t/${orderData.consignment.tracking_code}`
        }
        order.status = orderData.consignment.status.toUpperCase()
        order.save()
      }

      res.status(200).json({
        success: true,
      })
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
}
