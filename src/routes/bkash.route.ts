import { Router } from "express";
import { BkashRequest } from "../controller/bkash.controller";

const router = Router();
const handler = new BkashRequest();

router.post("/create-payment", handler.createPayment);

router.get("/execute-payment", handler.executePaymentCallback);

export default router;
