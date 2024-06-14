import mongoose from "mongoose";
import validator from "validator";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"],
    },
    email: {
      type: String,
      trim: true,
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
    // img: {
    //   type: String,
    //   required: false,
    //   validate: [validator.isURL, "Please provide valid url(s)"],
    // },
    address: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    nid: String,
    license: String,
    balance: Number,
    facebookProfile: String,
    facebookPage: String,
    role: {
      type: String,
      default: "SELLER",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


export const Seller = mongoose.model("Seller", sellerSchema);
