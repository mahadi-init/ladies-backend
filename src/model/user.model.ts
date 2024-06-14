import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: {
      type: String,
      required: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number",
      ],
    },
    address: String,
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
