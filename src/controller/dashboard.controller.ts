import { Request, Response } from "express";
import { Order } from "../model/order.model";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import secrets from "../config/secret";
import { ExtendedRequest } from "../types/extended-request";

// Apply necessary plugins to dayjs
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export class DashboardRequest {
  getSteadFastBalance = async (_: ExtendedRequest, res: Response) => {
    try {
      const data = await fetch(
        `${secrets.STEADFAST_BASE_URL}/api/v1/get_balance`,
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": secrets.STEADFAST_API_KEY,
            "Secret-Key": secrets.STEADFAST_SECRECT_KEY,
          },
        },
      );

      if (!data.ok) {
        throw new Error("Failed to fetch balance");
      }

      res.status(200).json({
        success: true,
        data: await data.json(),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getDashboardAmount = async (_: ExtendedRequest, res: Response) => {
    try {
      const todayStart = dayjs().startOf("day");
      const todayEnd = dayjs().endOf("day");

      const yesterdayStart = dayjs().subtract(1, "day").startOf("day");
      const yesterdayEnd = dayjs().subtract(1, "day").endOf("day");

      const monthStart = dayjs().startOf("month");
      const monthEnd = dayjs().endOf("month");

      const todayOrders = await Order.find({
        createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
      });

      let todayCashPaymentAmount = 0;
      let todayCardPaymentAmount = 0;

      todayOrders.forEach((order) => {
        if (order.paymentMethod === "COD") {
          todayCashPaymentAmount += order.totalAmount;
        } else if (order.paymentMethod === "Card") {
          todayCardPaymentAmount += order.totalAmount;
        }
      });

      const yesterdayOrders = await Order.find({
        createdAt: {
          $gte: yesterdayStart.toDate(),
          $lte: yesterdayEnd.toDate(),
        },
      });

      let yesterDayCashPaymentAmount = 0;
      let yesterDayCardPaymentAmount = 0;

      yesterdayOrders.forEach((order) => {
        if (order.paymentMethod === "COD") {
          yesterDayCashPaymentAmount += order.totalAmount;
        } else if (order.paymentMethod === "Card") {
          yesterDayCardPaymentAmount += order.totalAmount;
        }
      });

      const monthlyOrders = await Order.find({
        createdAt: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
      });

      const totalOrders = await Order.find();
      const todayOrderAmount = todayOrders.reduce(
        (total, order) => total + order.totalAmount,
        0,
      );
      const yesterdayOrderAmount = yesterdayOrders.reduce(
        (total, order) => total + order.totalAmount,
        0,
      );

      const monthlyOrderAmount = monthlyOrders.reduce((total, order) => {
        return total + order.totalAmount;
      }, 0);
      const totalOrderAmount = totalOrders.reduce(
        (total, order) => total + order.totalAmount,
        0,
      );

      res.status(200).json({
        success: true,
        data: {
          todayOrderAmount,
          yesterdayOrderAmount,
          monthlyOrderAmount,
          totalOrderAmount,
          todayCardPaymentAmount,
          todayCashPaymentAmount,
          yesterDayCardPaymentAmount,
          yesterDayCashPaymentAmount,
        },
      });
    } catch (error: any) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  };

  getSalesReport = async (_: ExtendedRequest, res: Response) => {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);

      const salesOrderChartData = await Order.find({
        updatedAt: {
          $gte: startOfWeek,
          $lte: new Date(),
        },
      });

      const salesReport = salesOrderChartData.reduce((res, value) => {
        const onlyDate = value.updatedAt.toISOString().split("T")[0];

        if (!res[onlyDate]) {
          res[onlyDate] = { date: onlyDate, total: 0, order: 0 };
        }
        res[onlyDate].total += value.totalAmount;
        res[onlyDate].order += 1;
        return res;
      }, {});

      const salesReportData = Object.values(salesReport);

      // Send the response to the client site
      res.status(200).json({
        success: true,
        data: salesReportData,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getMostSellingCategory = async (_: ExtendedRequest, res: Response) => {
    try {
      const categoryData = await Order.aggregate([
        {
          $unwind: "$cart", // Deconstruct the cart array
        },
        {
          $group: {
            _id: "$cart.productType",
            count: { $sum: "$cart.orderQuantity" },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      res.status(200).json({
        success: true,
        data: categoryData,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getDashboardRecentOrder = async (req: ExtendedRequest, res: Response) => {
    try {
      const { page, limit } = req.query;

      // const pages = Number(page) || 1;
      // const limits = Number(limit) || 8;
      // // const skip = (pages - 1) * limits;

      const queryObject = {
        status: { $in: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"] },
      };

      const totalDoc = await Order.countDocuments(queryObject);

      const orders = await Order.aggregate([
        { $match: queryObject },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            invoice: 1,
            createdAt: 1,
            updatedAt: 1,
            paymentMethod: 1,
            name: 1,
            user: 1,
            totalAmount: 1,
            status: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: {
          orders: orders,
          page: page,
          limit: limit,
          totalOrder: totalDoc,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
