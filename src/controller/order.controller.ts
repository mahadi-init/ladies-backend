import { Response } from "express";
import mongoose from "mongoose";
import secrets from "../config/secret";
import { SharedRequest } from "../helpers/SharedRequest";
import { Order } from "../model/order.model";
import { User } from "../model/user.model";
import { ExtendedRequest } from "../types/extended-request";

export class OrderRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getOrdersByPhone = async (req: ExtendedRequest, res: Response) => {
    try {
      const id = req.id;
      const phone = req.query.phone;
      let orders;

      if (id) {
        orders = await this.model.find({ sellerID: id });
      } else {
        orders = await this.model.find({ phone: phone });
      }

      let pendingOrder = 0;
      let processingOrder = 0;
      let completedOrder = 0;
      let totalOrder = 0;

      orders.map((item: any) => {
        switch (item.status) {
          case "WAITING":
            pendingOrder++;
            break;
          case "DELIVERED":
            completedOrder++;
            break;
          default:
            processingOrder++;
            break;
        }
      });

      totalOrder = pendingOrder + processingOrder + completedOrder;

      const count = {
        pendingOrder,
        processingOrder,
        completedOrder,
        totalOrder,
      };

      res.status(200).json({
        success: true,
        count: count,
        orders: orders,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  getPaginatedOrders = async (req: ExtendedRequest, res: Response) => {
    try {
      // query params
      const page = req.query.page;
      const limit = req.query.limit;
      let search = req.query.search;
      let status = req.query.status;
      let confirm = req.query.confirm;

      // filter by params
      const filterBy: "default" | "search" | "status" | "confirm" = req.query
        .filterBy as any;

      // check the types are number
      if (typeof page !== "string" || typeof limit !== "string")
        throw new Error("page and limit must be numbers");

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // empty array initialization
      let result: any = [];

      // filter by default
      if (filterBy === "default") {
        result = await Order.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      }

      // filter by search
      if (filterBy === "search") {
        result = await Order.find({
          $or: [
            { invoice: { $regex: search, $options: "i" } },
            { consignmentId: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            { sellerPhone: { $regex: search, $options: "i" } },
            { sellerName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      }

      // filter by status
      if (filterBy === "status") {
        if (status === "ALL") {
          result = await Order.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        } else if (status === "PROCESSING") {
          result = await Order.find({
            status: { $nin: ["WAITING", "DELIVERED", "CANCELLED"] },
          })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        } else {
          result = await Order.find({
            status: status,
          })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        }
      }

      // filter by confirm
      if (filterBy === "confirm") {
        if (confirm === "ALL") {
          result = await Order.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        } else {
          result = await Order.find({
            confirm: confirm,
          })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        }
      }

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

  refreshOrder = async (_: ExtendedRequest, res: Response) => {
    try {
      const result = await Order.find({});

      // steadfast status mapping
      result.map(async (r: any) => {
        const timeGap = Math.floor(
          (new Date().getTime() -
            (r.lastChecked ? new Date(r.lastChecked).getTime() : 0)) /
            1000 /
            60,
        );

        if (
          r.status !== "DELIVERED" &&
          r.status !== "CANCELLED" &&
          r.status !== "WAITING" &&
          timeGap > 60
        ) {
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
            const data = await status.json();

            if (data.status === 200) {
              r.status = data.delivery_status.toUpperCase();
            }
          }
          r.lastChecked = new Date();
          r.save();
        }
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

  addData = async (req: ExtendedRequest, res: Response) => {
    try {
      const id = req.id;
      let data;

      if (id) {
        data = await Order.create({ ...req.body, sellerID: id });
      } else {
        data = await Order.create({ ...req.body });

        // save user info and create user
        const { name, phone, address } = req.body;
        User.create({ name: name, phone: phone, address: address });
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
      const order = await Order.findOne({ invoice: body.invoice });

      if (order) {
        if (orderData.consignment.tracking_code) {
          order.trackingLink = `https://steadfast.com.bd/t/${orderData.consignment.tracking_code}`;
        }
        order.status = orderData.consignment.status.toUpperCase();
        order.save();
      }

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

  changeConfirmStatus = async (req: ExtendedRequest, res: Response) => {
    try {
      await Order.findByIdAndUpdate(req.params.id, {
        confirm: req.body.confirm,
      });

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  };

  changeOrderStatus = async (req: ExtendedRequest, res: Response) => {
    try {
      await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  };

  refreshData = async (_: ExtendedRequest, res: Response) => {
    try {
      const result = await Order.find({});

      // steadfast status mapping
      result.map(async (r: any) => {
        const timeGap = Math.floor(
          (new Date().getTime() -
            (r.lastChecked ? new Date(r.lastChecked).getTime() : 0)) /
            1000 /
            60,
        );

        if (
          r.status !== "DELIVERED" &&
          r.status !== "CANCELLED" &&
          r.status !== "WAITING" &&
          timeGap > 60
        ) {
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
            const data = await status.json();

            if (data.status === 200) {
              r.status = data.delivery_status.toUpperCase();
            }
          }
          r.lastChecked = new Date();
          r.save();
        }
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
