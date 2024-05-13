import { Request, Response } from "express";
import { SharedRequest } from "../helpers/SharedRequest";
import mongoose from "mongoose";
import { Product } from "../model/product.model";
import { Brand } from "../model/brand.model";
import { Category } from "../model/category.model";

export class ProductRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }

  getSingleData = async (req: Request, res: Response) => {
    try {
      const result = await Product.findById(req.params.id).populate({
        path: "reviews",
        populate: { path: "userId", select: "name phone" },
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

  getSearchData = async (req: Request, res: Response) => {
    try {
      const q = req.query.q;

      const result = await Product.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { cid: { $regex: q, $options: "i" } },
          { sku: { $regex: q, $options: "i" } },
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

  getOfferTimeProduct = async (req: Request, res: Response) => {
    try {
      const result = await Product.find({
        productType: req.query.type,
        "offerDate.endDate": {
          $gt: new Date(),
        },
      }).populate("reviews");

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

  getTopRated = async (_: Request, res: Response) => {
    try {
      const products = await Product.find({
        reviews: { $exists: true, $ne: [] },
      }).populate("reviews");

      const topRatedProducts = products.map((product) => {
        const totalRating = product.reviews.reduce(
          (sum: number, review: { rating: number }) => sum + review.rating,
          0,
        );
        const averageRating = totalRating / product.reviews.length;

        return {
          ...product.toObject(),
          rating: averageRating,
        };
      });

      topRatedProducts.sort((a, b) => b.rating - a.rating);

      res.status(200).json({
        success: true,
        data: topRatedProducts,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getReviewProduct = async (_: Request, res: Response) => {
    try {
      const result = await Product.find({
        reviews: { $exists: true },
      }).populate({
        path: "reviews",
        populate: { path: "userid", select: "name email imageurl" },
      });

      const products = result.filter((p) => p.reviews.length > 0);

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  getPopularProducts = async (req: Request, res: Response) => {
    try {
      const result = await Product.find({ productType: req.params.type })
        .sort({ "reviews.length": -1 })
        .limit(8)
        .populate("reviews");

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  getTypeOfProducts = async (req: Request, res: Response) => {
    try {
      const type = req.params.type;

      let products;

      if (req.query.new === "true") {
        products = await Product.find({ productType: type })
          .sort({ createdAt: -1 })
          .limit(8)
          .populate("reviews");
      } else if (req.query.featured === "true") {
        products = await Product.find({
          productType: type,
          featured: true,
        }).populate("reviews");
      } else if (req.query.topSellers === "true") {
        products = await Product.find({ productType: type })
          .sort({ sellCount: -1 })
          .limit(8)
          .populate("reviews");
      } else {
        products = await Product.find({ productType: type }).populate(
          "reviews",
        );
      }

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  getRelatedProducts = async (req: Request, res: Response) => {
    try {
      const currentProduct = await Product.findById(req.params.id);

      const result = await Product.find({
        "category.name": currentProduct?.category?.name,
        _id: { $ne: req.params.id },
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error,
      });
    }
  };

  getStockoutProducts = async (_: Request, res: Response) => {
    try {
      const result = await Product.find({ status: "OUT-OF-STOCK" }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        sucess: false,
        message: error.message,
      });
    }
  };

  addProduct = async (req: Request, res: Response) => {
    try {
      const { brand, category } = req.body;
      console.log(brand, category);

      if (!brand || !category) {
        throw new Error("Brand and category are required");
      }

      // get brand & categoryid
      const brandId = (await Brand.findOne({ name: brand.name }))?.id;
      const categoryId = (await Category.findOne({ name: category.name }))?.id;

      const result = await Product.create({
        ...req.body,
        brand: {
          name: brand.name,
          id: brandId,
        },
        category: {
          name: category.name,
          id: categoryId,
        },
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
