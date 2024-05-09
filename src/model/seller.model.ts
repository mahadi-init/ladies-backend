import mongoose from "mongoose";
import validator from "validator";
const { ObjectId } = mongoose.Schema.Types;

const sellerSchema = new mongoose.Schema(
  {
    cid: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },
    img: {
      type: String,
      required: false,
      validate: [validator.isURL, "Please provide valid url(s)"],
    },
    address: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    nid: String,
    license: String,
    balance: Number,
    sales: Number,
    commission: Number,
    facebookProfile: String,
    facebookPage: String,
    transcations: [
      {
        type: ObjectId,
        ref: "Transaction",
      },
    ],
    orders: [
      {
        type: ObjectId,
        ref: "Order",
      },
    ],
    referrals: [
      {
        type: ObjectId,
        ref: "Seller",
      },
    ],
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

sellerSchema.pre("save", async function (next) {
  const seller = this;
  if (!seller.cid) {
    try {
      const highestCid = await mongoose
        .model("Seller")
        .find({})
        .sort({ cid: "desc" })
        .limit(1)
        .select({ cid: 1 });

      const startingCid =
        highestCid.length === 0 ? 1000 : highestCid[0].cid + 1;
      seller.cid = startingCid;
      next();
    } catch (err: any) {
      next(err);
    }
  } else {
    next();
  }
});

export const Seller =
  mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
