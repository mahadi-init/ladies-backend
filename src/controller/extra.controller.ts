// @ts-check
import { Request, Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";

export class ExtraRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getAllData = async (_: Request, res: Response) => {
    try {
      const productTypes = await this.model.find({}).distinct("productType");
      const colors = await this.model.find({}).distinct("color");
      const sizes = await this.model.find({}).distinct("size");

      res.status(200).json({
        success: true,
        data: { productTypes, colors, sizes },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  allProductTypes = async (_: Request, res: Response) => {
    try {
      const result = await this.model.find({}).distinct("productType");

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

  allColors = async (_: Request, res: Response) => {
    try {
      const result = await this.model.find({}).distinct("color");

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

  allSizes = async (_: Request, res: Response) => {
    try {
      const result = await this.model.find({}).distinct("size");

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
