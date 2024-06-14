import { Router } from "express";
import { OrderRequest } from "../controller/order.controller";
import { Order } from "../model/order.model";
import { setAuthInfoWithReq } from "../utils/jwt-auth";

const router = Router();
const handler = new OrderRequest(Order);

router.get("/all",  handler.getAllData);

router.get("/get/:id", handler.getSingleData);

router.get("/count/me", handler.getOrdersByPhone)   // by phone, query params

router.get("/page",  handler.pagination);

router.get("/total-pages",  handler.getTotalPages);

router.get("/search",  handler.search);

router.post("/add", handler.addData);

router.post("/send-order",  handler.sendOrder)

router.delete("/delete/:id",  handler.deleteData)

export default router;
