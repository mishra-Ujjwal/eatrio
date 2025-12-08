
import restaurantModel from "../models/restaurant.model.js";
import Wallet from "../models/wallet.model.js";
import Withdrawal from "../models/withdrawl.model.js";

export const ownerWithdraw = async (req, res) => {
  try {
    const { restaurantId, amount, bankAccountId } = req.body;

    const wallet = await Wallet.findOne({ restaurantId });
    if (!wallet)
      return res.status(404).json({ success: false, message: "Wallet not found" });

    const selectedBank = wallet.bankAccounts.id(bankAccountId);
    if (!selectedBank)
      return res.status(400).json({
        success: false,
        message: "Please select a valid bank account.",
      });

    const withdrawAmount = Number(amount);
    if (wallet.availableBalance < withdrawAmount)
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });

    const payoutId = "test_payout_" + Date.now();

    // 1️⃣ Create withdrawal entry in Withdrawal model
    const newWithdraw = await Withdrawal.create({
      restaurantId,
      walletId: wallet._id,
      amount: withdrawAmount,
      transactionId: payoutId,
      status: "pending",
    });

    // 2️⃣ Update wallet
    wallet.availableBalance -= withdrawAmount;
    wallet.withdrawnTotal += withdrawAmount;

    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal Successful",
      payoutId,
      withdrawal: newWithdraw,
      wallet,
    });

  } catch (error) {
    console.error("Withdraw Error:", error);
    res.status(500).json({
      success: false,
      message: "Withdraw failed",
      error: error.message,
    });
  }
};

export const getOwnerWithdrawHistory = async (req, res) => {
  try {

    const ownerId = req.owner._id;

    // Find restaurant of logged-in owner
    const restaurant = await restaurantModel.findOne({ owner:ownerId });
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });

    const history = await Withdrawal.find({ restaurantId:restaurant._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, history });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getOwnerLastWithdrawal = async (req, res) => {
  try {
    const restaurantId = req.owner._id;

    const last = await Withdrawal.findOne({ restaurantId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, last });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
