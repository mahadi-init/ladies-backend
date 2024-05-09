//@ts-check
import { Router } from "express";
import { Coupon } from "../model/coupon.model";
import { CouponRequest } from "../requests/CouponRequest";

const router = Router();
const handler = new CouponRequest(Coupon);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/total-pages", handler.getTotalPages); // GET TOTAL

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.search); // SEARCH

router.post("/add", handler.addData); // ADD

router.patch("/edit/:id", handler.updateData); // EDIT

router.delete("/delete/:id", handler.deleteData); // DELETE

export default router;
