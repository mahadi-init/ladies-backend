// @ts-check
import { Router } from "express";
import { Transaction } from "../model/transaction.model";

const router = Router();

// get seller last data
router.get("/last/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const withdraw = await Transaction.findOne({ sellerId: id })
      .where("withdraw")
      .gt(0)
      .sort({ createdAt: -1 })
      .populate("createdAt");

    const deposit = await Transaction.findOne({ sellerId: id })
      .where("deposit")
      .gt(0)
      .sort({ createdAt: -1 })
      .populate("createdAt");

    res.status(200).json({
      success: true,
      data: {
        deposit,
        withdraw,
      },
    });
  } catch (error) {
    next(error);
  }
});

// get seller last deposite
router.get("/deposit/:id", async (req, res, next) => {
  try {
    const result = await Transaction.findOne({ sellerId: req.params.id })
      .where("deposit")
      .gt(0)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// get seller last withdraw
router.get("/withdraw/:id", async (req, res, next) => {
  try {
    const result = await Transaction.findOne({ sellerId: req.params.id })
      .where("withdraw")
      .gt(0)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
