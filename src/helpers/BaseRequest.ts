import { Request, Response } from "express";
import mongoose from "mongoose";

export class BaseRequest {
  readonly model: typeof mongoose.Model;

  constructor(model: typeof mongoose.Model) {
    this.model = model;
  }

  getAllData = async (_: Request, res: Response) => {
    try {
      const data = await this.model.find({});

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

  getSingleData = async (req: Request, res: Response) => {
    try {
      const data = await this.model.findById(req.params.id);

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

  addData = async (req: Request, res: Response) => {
    try {
      const data = await this.model.create(req.body);

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

  updateData = async (req: Request, res: Response) => {
    try {
      await this.model.findByIdAndUpdate(req.params.id, req.body);

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

  deleteData = async (req: Request, res: Response) => {
    try {
      await this.model.findByIdAndDelete(req.params.id);

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
