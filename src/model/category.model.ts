import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    img: String,
    children: [{ type: String }],
    productType: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    description: String,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model("Category", categorySchema);
