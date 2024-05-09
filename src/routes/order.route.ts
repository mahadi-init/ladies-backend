//@ts-check
import { Router } from "express";
import { Order } from "../model/order.model";
import { SharedRequest } from "../helpers/SharedRequest";

const router = Router();
const handler = new SharedRequest(Order);

router.get("/all", handler.getAllData); // GET ALL

export default router;
