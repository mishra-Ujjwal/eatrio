import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      }, // menu item id
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      quantity: { type: Number, default: 1 },
      selectedAddons: [
        {
          name: String,
          price: Number,
        },
      ],
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "cancelled"],
    default: "pending",
  },
  payment: {
    mode: { type: String, enum: ["online", "cash"], default: "cash" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: String,
  },
  pickupTable: { type: String, required: true },
  specialInstructions: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  commissionPercentage: {
    type: Number,
    default: 3, // 3% default
  },

  commissionAmount: {
    type: Number,
    default: 0,
  },

  restaurantEarning: {
    type: Number,
    default: 0,
  },

  platformEarning: {
    type: Number,
    default: 0,
  },
});

OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    let unique = false;
    let generatedCode = "";

    while (!unique) {
      // Generate 5-character alphanumeric code
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      generatedCode = `#${random}`;

      // Check if it already exists
      const existingOrder = await mongoose.models.Order.findOne({
        orderNumber: generatedCode,
      });
      if (!existingOrder) {
        unique = true;
      }
    }

    this.orderNumber = generatedCode;
  }

  next();
});

export default mongoose.model("Order", OrderSchema);
