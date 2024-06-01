import mongoose from "mongoose";
import validator from "validator";
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    cid: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: String,
    img: {
      type: String,
      required: true,
      validate: [validator.isURL, "Please provide valid url(s)"],
    },
    unit: String,
    variants: [
      {
        color: String,
        // code: String,
        img: String,
        size: String,
        quantity: Number,
        price: Number,
      },
    ],
    children: [String],
    price: {
      type: Number,
      required: true,
      min: [0, "Product price can't be negative"],
    },
    sellerPrice: {
      type: Number,
      required: true,
      min: [0, "Price can't be negative"],
    },
    //in tk not in percentage
    discount: {
      type: Number,
      min: [0, "Discount can't be negative"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Product quantity can't be negative"],
    },
    productType: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoId: String,
    brand: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: ObjectId,
        ref: "Brand",
        required: true,
      },
    },
    category: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: ObjectId,
        ref: "Category",
        required: true,
      },
    },
    status: {
      type: String,
      default: "IN-STOCK",
      enum: {
        values: ["IN-STOCK", "OUT-OF-STOCK", "DISCONTINUED"],
        message: "status can't be {VALUE} ",
      },
    },
    reviews: [{ type: ObjectId, ref: "Review" }],
    additionalInformation: [
      {
        key: String,
        value: String,
      },
    ],
    tags: [String],
    sizes: [String],
    offerDate: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sellCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  const product = this;
  if (!product.cid) {
    try {
      const highestCid = await mongoose
        .model("Product")
        .find({})
        .sort({ cid: "desc" })
        .limit(1)
        .select({ cid: 1 });

      const startingCid =
        highestCid.length === 0 ? 1000 : highestCid[0].cid + 1;
      product.cid = startingCid;
      next();
    } catch (err: any) {
      next(err);
    }
  } else {
    next();
  }
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
