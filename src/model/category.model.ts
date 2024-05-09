import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    img: {
      type: String,
      required: false,
    },
    children: [{ type: String }],
    productType: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: false,
    },
    products: [
      {
        type: ObjectId,
        ref: "Products",
      },
    ],
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
