import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    sellerID: String,
    cart: [
      {
        id: ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        img: String,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    referral: String,
    note: String,
    trackingLink: String,
    invoice: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      default: "PENDING",
    },
    lastChecked: Date
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", async function (next) {
  this.invoice = this._id.toString().slice(-7)
});

export const Order = mongoose.model("Order", orderSchema);
