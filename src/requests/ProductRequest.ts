// @ts-check
import { SharedRequest } from "../helpers/SharedRequest";
import mongoose from "mongoose";

export class ProductRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }
}
