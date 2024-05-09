import mongoose from "mongoose";
import config from "./secret";
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("mongodb connection success!");
  } catch (err) {
    console.log("mongodb connection failed!", err);
  }
};

export default connectDB;
