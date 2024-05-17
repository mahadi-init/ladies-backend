import { Router } from "express";
import { SellerRequest } from "../controller/seller.controller";
import { Seller } from "../model/seller.model";

const router = Router();
const handler = new SellerRequest(Seller);

router.get("/all", handler.getAllData); // GET ALL

router.get("/get/:id", handler.getSingleData); // GET SINGLE

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/status/:id", handler.getStatus); // GET STATUS

router.get("/search", handler.search); // SEARCH

router.post("/register", handler.addData); // ADD NEW SELLER

router.post("/login", handler.login); // LOGIN

router.patch("/edit/:id", handler.updateData); // UPDATE SELLR

router.patch("/change-status/:id", handler.changeStatus); // UPDATE STATUS

router.patch("/change-password/:id", handler.changePassword); // CHANGE PASSWORD

router.delete("/delete/:id", handler.deleteData); // DELETE DATA

export default router;
