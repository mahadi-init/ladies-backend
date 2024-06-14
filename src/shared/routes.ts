import { Router } from "express";
import admin from "./../routes/admin.route";
import bkash from "./../routes/bkash.route";
import dashboard from "./../routes/dashboard.route";
import extra from "./../routes/extra.route";
import order from "./../routes/order.route";
import product from "./../routes/product.route";
import review from "./../routes/review.route";
import seller from "./../routes/seller.route";
import transaction from "./../routes/transaction.route";
import user from "./../routes/user.route";
import withdraw from "./../routes/withdraw.route";
import auth from "./../routes/auth.route"

const router = Router();

router.use("/auth", auth)
router.use("/admin", admin);
router.use("/extra", extra);
router.use("/order", order);
router.use("/product", product);
router.use("/review", review);
router.use("/seller", seller);
router.use("/transaction", transaction);
router.use("/user", user);
router.use("/bkash", bkash);
router.use("/withdraw", withdraw);
router.use("/dashboard", dashboard);

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
