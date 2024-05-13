import { Router } from "express";
import { Transaction } from "../model/transaction.model";
import { TransactionRequest } from "../controller/transaction.controller";

const router = Router();
const handler = new TransactionRequest(Transaction);

router.get("/transaction/:id", handler.getWithdrawDepositeData); // GET LAST WITHDRAW AND DEPOSITE

router.get("/deposit/:id", handler.getLastDepositeData); // GET LAST DEPOSITE

router.get("/withdraw/:id", handler.getLastWithdrawData); // GET LAST WITHDRAW

export default router;
