
import restaurantModel from "../models/restaurant.model.js";
import Wallet from "../models/wallet.model.js";
import Withdrawal from "../models/withdrawl.model.js";

export const ownerWithdraw = async (req, res) => {
  try {
    const { restaurantId, amount } = req.body;

    const wallet = await Wallet.findOne({ restaurantId });

    if (!wallet)
      return res.status(404).json({ success: false, message: "Wallet not found" });

    // 😎 Must have at least 1 bank account
    if (wallet.bankAccounts.length === 0)
      return res.status(400).json({
        success: false,
        message: "Add at least one bank account before withdrawing.",
      });

    // ✔ Find default bank account
    const defaultBank = wallet.bankAccounts.find((a) => a.isDefault);

    if (!defaultBank)
      return res.status(400).json({
        success: false,
        message: "Please set a default bank account.",
      });

    const withdrawAmount = Number(amount);

    if (wallet.availableBalance < withdrawAmount)
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });

    const payoutId = "test_payout_" + Date.now();

    wallet.availableBalance -= withdrawAmount;
    wallet.withdrawnTotal += withdrawAmount;

    wallet.withdrawHistory.push({
      amount: withdrawAmount,
      status: "success",
      date: new Date(),
      payoutId,
      bankUsed: defaultBank,
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal Successful",
      payoutId,
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
