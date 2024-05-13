import { Router } from "express";
import { BkashRequest } from "../controller/bkash.controller";

const router = Router();
// TODO: ADD USER ROUTE
const handler = new BkashRequest("", "http://localhost:3000/seller");

// router.get("/grant-token", handler.grantToken); // GET GRANT TOKEN

router.post("/create-payment", handler.createPayment); // CREATE PAYMENT

// router.get("/payment-callback", handler.paymentCallback); // PAYMENT CALLBACK

router.get("/execute-payment/seller/:id", handler.executeSellerPaymentCallback); // EXECUTE PAYMENT

// router.get("/execute-payment/user/:id", handler.executeCallbackPayment); // USER PAYMENT

export default router;
