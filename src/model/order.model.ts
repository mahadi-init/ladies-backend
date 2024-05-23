import mongoose from "mongoose";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    personId: {
      type: String,
      required: true,
    },
    isSeller: {
      type: Boolean,
      required: true,
    },
    cart: [
      {
        type: ObjectId,
        ref: "Product",
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
    city: String,
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    referral: String,
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentDetails: {},
    orderNote: String,
    trackingCode: String,
    trackingLink: String,
    invoice: {
      type: Number,
      unique: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

// define pre-save middleware to generate the invoice number
orderSchema.pre("save", async function (next) {
  const order = this;
  if (!order.invoice) {
    // check if the order already has an invoice number
    try {
      // find the highest invoice number in the orders collection
      const highestInvoice = await mongoose
        .model("Order")
        .find({})
        .sort({ invoice: "desc" })
        .limit(1)
        .select({ invoice: 1 });
      // if there are no orders in the collection, start at 1000
      const startingInvoice =
        highestInvoice.length === 0 ? 1000 : highestInvoice[0].invoice + 1;
      // set the invoice number for the new order
      order.invoice = startingInvoice;
      next();
    } catch (err: any) {
      next(err);
    }
  } else {
    next();
  }
});

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
