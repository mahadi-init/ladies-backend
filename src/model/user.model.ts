import mongoose, { Types } from "mongoose";
import validator from "validator";

const ObjectId = Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Must be at least 6 character"],
    },
    phone: {
      type: String,
      required: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number",
      ],
    },
    address: String,
    role: {
      type: String,
      deafult: "USER",
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    reviews: [{ type: ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
