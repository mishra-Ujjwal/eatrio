import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    availableBalance: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    totalCommission: {
      type: Number,
      default: 0,
    },

    withdrawnTotal: {
      type: Number,
      default: 0,
    },

     bankAccounts: [
      {
        accountHolderName: String,
        accountNumber: String,
        ifsc: String,
        bankName: String,
        mobileNumber: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", walletSchema);
