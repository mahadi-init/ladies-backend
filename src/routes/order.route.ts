import { Router } from "express";
import { OrderRequest } from "../controller/order.controller";
import { Order } from "../model/order.model";

const router = Router();
const handler = new OrderRequest(Order);

router.get("/all", handler.getAllData);

router.get("/get/:id", handler.getSingleData);

router.get("/count/me", handler.getOrdersByPhone); // by phone, query params

router.get("/page", handler.getPaginatedOrders);

router.get("/total-pages", handler.getTotalPages);

router.get("/search", handler.search);

router.post("/add", handler.addData);

router.post("/send-order", handler.sendOrder);

router.patch("/change-confirm-status/:id", handler.changeConfirmStatus);

router.patch("/change-order-status/:id", handler.changeOrderStatus);

router.patch("/refresh", handler.refreshData);

router.delete("/delete/:id", handler.deleteData);

export default router;
