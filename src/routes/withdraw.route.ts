import { Router } from "express";
import { WithdrawRequest } from "../controller/withdraw.controller";
import { Withdraw } from "../model/withdraw.model";

const router = Router();
const handler = new WithdrawRequest(Withdraw);

router.get("/all", handler.getAllData);

router.get("/get/:id", handler.getSingleData);

router.get("/last", handler.getLastWithdraw);

router.get("/all/:id", handler.getAllWithdraws);

router.get("/total-pages", handler.getTotalPages);

router.get("/page", handler.pagination);

router.get("/search", handler.search);

router.post("/add", handler.addData);

router.delete("/delete/:id", handler.deleteData);

export default router;
