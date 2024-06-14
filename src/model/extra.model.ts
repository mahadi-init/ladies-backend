import mongoose from "mongoose";

const extraSchema = new mongoose.Schema(
  {
    color: {
      name: {
        type: String,
        lowercase: true,
        trim: true,
      },
      code: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    size: String,
  },
  {
    timestamps: true,
  },
);

export const Extra = mongoose.model("Extra", extraSchema);
