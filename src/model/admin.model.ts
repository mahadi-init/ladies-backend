import mongoose from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema(
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
    address: String,
    role: {
      type: String,
      default: "EDITOR",
      enum: ["SUPERADMIN", "ADMIN", "EDITOR"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Admin = mongoose.model("Admin", adminSchema);
