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

      let todayPayment = 0;
      let todayCardPaymentAmount = 0;

      todayOrders.forEach((order) => {
        todayPayment += order.total;
      });

      const yesterdayOrders = await Order.find({
        createdAt: {
          $gte: yesterdayStart.toDate(),
          $lte: yesterdayEnd.toDate(),
        },
      });

      let yesterdayPayment = 0;
      let yesterDayCardPaymentAmount = 0;

      yesterdayOrders.forEach((order) => {
        yesterdayPayment += order.total
      });

      const monthlyOrders = await Order.find({
        createdAt: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
      });

      const totalOrders = await Order.find();
      const todayOrderAmount = todayOrders.reduce(
        (total, order) => total + order.total,
        0,
      );
      const yesterdayOrderAmount = yesterdayOrders.reduce(
        (total, order) => total + order.total,
        0,
      );

      const monthlyOrderAmount = monthlyOrders.reduce((total, order) => {
        return total + order.total;
      }, 0);
      const totalOrderAmount = totalOrders.reduce(
        (total, order) => total + order.total,
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
          todayCashPaymentAmount: todayPayment,
          yesterDayCardPaymentAmount,
          yesterDayCashPaymentAmount: yesterdayPayment,
        },
      });
    } catch (error: any) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  };

  getDashboardPendingOrders = async (_: ExtendedRequest, res: Response) => {
    try {
      const queryObject = {
        status: { $in: ["PENDING"] },
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
