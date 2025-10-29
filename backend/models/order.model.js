import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
      quantity: { type: Number, default: 1 },
      selectedAddons: [
        {
          name: String,
          price: Number
        }
      ]
    }
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "cancelled"],
    default: "pending"
  },
  payment: {
    mode: { type: String, enum: ["online", "cash"], default: "cash" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: String
  },
  pickupTable: { type: String, required: true }, // Mandatory table number
  specialInstructions: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);
