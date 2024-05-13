import mongoose from "mongoose";

const bkashSchema = new mongoose.Schema({
  id_token: String,
  lastRefreshed: Date,
});

export const Bkash = mongoose.model("Bkash", bkashSchema);
