
import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    active: { type: Boolean, default: false },
    plan: { type: String, default: null },
    startDate: { type: Date },
    endDate: { type: Date },
    paymentId: { type: String }, // store transaction/payment reference
  },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
});

export default mongoose.model("Owner", ownerSchema);