import { Router } from "express";
import { WithdrawRequest } from "../controller/withdraw.controller";
import { Withdraw } from "../model/withdraw.model";

const router = Router();
const handler = new WithdrawRequest(Withdraw);

router.get("/all", handler.getAllData); // GET ALL DATA

router.get("/get/:id", handler.getSingleData); // GET SINGLE DATA

router.get("/last/:id", handler.getLastWithdraw); // GET LAST WITHDRAW

router.get("/all/:id", handler.getAllWithdraws); // GET ALL WITHDRAWs

router.get("/total-pages", handler.getTotalPages); // GET TOTAL PAGES

router.get("/page", handler.pagination); // PAGINATION

router.get("/search", handler.search); // SEARCH

router.post("/add", handler.addData); // ADD NEW DATA

router.patch("/edit/:id", handler.updateData); // UPDATE DATA

router.patch("/change-status/:id", handler.changeStatus); // UPDATE STATUS

router.delete("/delete/:id", handler.deleteData); // DELETE DATA

export default router;
