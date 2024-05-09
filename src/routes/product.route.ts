//@ts-check
import { Router } from "express";
import { Brand } from "../model/brand.model";
import { Category } from "../model/category.model";
import { Product } from "../model/product.model";
import { ProductRequest } from "../requests/ProductRequest";

const router = Router();
const handler = new ProductRequest(Product);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", async (req, res, next) => {
  try {
    const result = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "userId", select: "name phone" },
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

// search
router.get("/search", async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
});

// get offer timer product
router.get("/offer", async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
});

// get top rated products
router.get("/top-rated", async (_, res, next) => {
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
  } catch (error) {
    next(error);
  }
});

// get review product
router.get("/review", async (_, res, next) => {
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
    next(error);
  }
});

// get popular products
router.get("/popular/:type", async (req, res, next) => {
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
    next(error);
  }
});

// get type of products
router.get("/:type", async (req, res, next) => {
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
      products = await Product.find({ productType: type }).populate("reviews");
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// get related products
router.get("/related/:id", async (req, res, next) => {
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
    next(error);
  }
});

// stock product
router.get("/stock-out", async (_, res, next) => {
  try {
    const result = await Product.find({ status: "OUT-OF-STOCK" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// add a product
router.post("/add", async (req, res, next) => {
  try {
    const { brand, category } = req.body;

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
  } catch (error) {
    next(error);
  }
});

router.patch("/edit-product/:id", handler.updateData); // UPDATE

router.delete("/delete/:id", handler.deleteData); // DELETE

export default router;