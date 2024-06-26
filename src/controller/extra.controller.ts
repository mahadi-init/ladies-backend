import { Request, Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";
import { ExtendedRequest } from "../types/extended-request";

export class ExtraRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getAllData = async (_: ExtendedRequest, res: Response) => {
    try {
      const colors = await this.model.find({}).distinct("color");
      const sizes = await this.model.find({}).distinct("size");

      res.status(200).json({
        success: true,
        data: { colors, sizes },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };


  allColors = async (_: ExtendedRequest, res: Response) => {
    try {
      const data = await this.model.find({}).distinct("color");

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

  allSizes = async (_: ExtendedRequest, res: Response) => {
    try {
      const data = await this.model.find({}).distinct("size");
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

  deleteByQuery = async (req: ExtendedRequest, res: Response) => {
    try {
      const color = req.query.color;
      const size = req.query.size;

      if (color) {
        await this.model.deleteMany({ "color.name": color });
      } else if (size) {
        await this.model.deleteMany({ size: size });
      } else {
        return res.status(400).json({
          success: false,
          message: "Empty query",
        });
      }

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
