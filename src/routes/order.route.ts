import { Router } from "express";
import { OrderRequest } from "../controller/order.controller";
import { Order } from "../model/order.model";

const router = Router();
const handler = new OrderRequest(Order);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/by-person-id/:id", handler.getOrdersByPersonID); // GET BY PERSON ID

router.get("/page", handler.pagination); // PAGINATION

router.get("/total-pages", handler.getTotalPages); // TOTAL PAGES

router.search("/search", handler.search); // SEARCH

router.post("/add", handler.addData); // ADD DATA

router.patch("/change-status", handler.changeStatus); // CHANGE STATUS

export default router;
