import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      reuired: true,
      default: "anonymous",
    },
    product: {
      type: ObjectId,
      ref: "Product",
    },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Review = mongoose.model("Review", reviewSchema);
