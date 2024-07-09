import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    person: String,
    isSeller: Boolean,
    amount: String,
    merchantInvoiceNumber: String,
    paymentCreateTime: String,
    paymentID: String,
    transactionStatus: String,
  },
  {
    timestamps: true,
  },
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
