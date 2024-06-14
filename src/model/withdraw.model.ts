import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const withdrawSchema = new mongoose.Schema(
  {
    seller: {
      type: ObjectId,
      ref: "Seller",
      required: true,
    },
    status: {
      type: String,
      default: "PENDING",
    },
    amount: {
      type: Number,
      requried: true,
    },
    message: String,
    bkash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Withdraw = mongoose.model("Withdraw", withdrawSchema);
