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
    email: {
      type: String,
      required: true,
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
    img : String,
    role: {
      type: String,
      deafult: "ADMIN"
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", adminSchema);
