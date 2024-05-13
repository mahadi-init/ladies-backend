import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";

export class UserRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }
}
