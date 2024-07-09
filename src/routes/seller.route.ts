import { Router } from "express";
import { SellerRequest } from "../controller/seller.controller";
import { Seller } from "../model/seller.model";

const router = Router();
const handler = new SellerRequest(Seller);

router.get("/all", handler.getAllData);

router.get("/get/:id", handler.getSingleData);

router.get("/total-pages", handler.getTotalPages);

router.get("/page", handler.pagination);

// router.get("/search", handler.search);

router.get("/info/me", handler.getCurrentSellerData)

// NOTE: ORDER

router.get("/order/:id", handler.orderPagination);

router.get("/order/total-pages/:id", handler.getOrderTotalPages);

router.get("/order/search/:id", handler.orderSearch);

// NOTE: ORDER END

router.post("/register", handler.addData);

router.patch("/edit", handler.updateData);

router.patch("/edit/:id", handler.updateData);

router.patch("/approve/:id", handler.approveSeller);

router.patch("/refresh", handler.refresh)

router.patch("/change-password/:id", handler.changePassword);

router.delete("/delete/:id", handler.deleteData);

export default router;
