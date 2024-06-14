import { Router } from "express";
import { Transaction } from "../model/transaction.model";
import { TransactionRequest } from "../controller/transaction.controller";

const router = Router();
const handler = new TransactionRequest(Transaction);

router.get("/last", handler.getLastTransaction); // GET LAST TRANSACTION

router.get("/all/:id", handler.getAllTransactionsByID); // GET ALL TRANSACTION

export default router;
