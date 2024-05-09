import { Router } from "express";
import admin from "./../routes/admin.route";
import brand from "./../routes/brand.route";
import category from "./../routes/category.route";
import coupon from "./../routes/coupon.route";
import extra from "./../routes/extra.route";
import order from "./../routes/order.route";
import product from "./../routes/product.route";
import review from "./../routes/review.route";
import seller from "./../routes/seller.route";
import transaction from "./../routes/transaction.route";
import user from "./../routes/user.route";

const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome To The API");
});

router.use("/admin", admin);
router.use("/brand", brand);
router.use("/category", category);
router.use("/coupon", coupon);
router.use("/extra", extra);
router.use("/order", order);
router.use("/product", product);
router.use("/review", review);
router.use("/seller", seller);
router.use("/transaction", transaction);
router.use("/user", user);

// Handle not found
router.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default router;
