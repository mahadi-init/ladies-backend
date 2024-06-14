import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: String,
    slug: String,
    unit: String,
    variants: [
      {
        color: String,
        img: String,
        size: String,
        quantity: Number,
        price: Number,
        sellerPrice: Number
      },
    ],
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    description: {
      type: String,
      required: true,
    },
    videoId: String,
    status: {
      type: String,
      default: "IN-STOCK",
      enum: ["IN-STOCK", "OUT-OF-STOCK", "DISCONTINUED"],
    },
    // reviews: [{ type: ObjectId, ref: "Review" }],
    additionalInformation: [
      {
        key: String,
        value: String,
      },
    ],
    sellCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", async function (next) {
  const product = this;

  if (!product.slug) {
    product.slug = product.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  if (!product.sku) {
    product.sku = product.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  next();
});

export const Product = mongoose.model("Product", productSchema);
