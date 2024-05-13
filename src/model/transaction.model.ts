import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    person: String,
    amount: String,
    merchantInvoiceNumber: String,
    paymentCreateTime: String,
    paymentID: String,
    transactionStatus: String,
    isSeller: Boolean,
  },
  {
    timestamps: true,
  },
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
