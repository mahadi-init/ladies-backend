import { SharedRequest } from "../helpers/SharedRequest";
import mongoose from "mongoose";

export class SellerRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }
}
