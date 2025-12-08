import Wallet from "../models/wallet.model.js";
import withdrawlModel from "../models/withdrawl.model.js";

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
        message: "Invalid bank account selected",
      });

    const withdrawAmount = Number(amount);
    if (wallet.availableBalance < withdrawAmount)
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });

    // 🎯 Mock Payout ID (test mode)
    const transactionId = "test_payout_" + Date.now();

    // ⭐ Create withdrawal entry in DB
    const withdrawal = await withdrawlModel.create({
      restaurantId,
      walletId: wallet._id,
      amount: withdrawAmount,
      status: "completed",   // in real Razorpay → change based on webhook
      transactionId,
    });

    // ⭐ Update wallet
    wallet.availableBalance -= withdrawAmount;
    wallet.withdrawnTotal += withdrawAmount;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal Successful",
      transactionId,
      selectedBank,
      withdrawal,
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

export const addBankAccount = async (req, res) => {
  try {
    const { restaurantId,accountHolderName, accountNumber, ifsc, bankName,mobileNumber} = req.body;

    // Find the wallet for logged-in restaurant
    const wallet = await Wallet.findOne({ restaurantId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    // Create bank object
    const newAccount = {
      accountHolderName,
      accountNumber,
      ifsc,
      bankName,
      mobileNumber,
    };

    // Push into bankAccounts array
    wallet.bankAccounts.push(newAccount);
    await wallet.save();

    res.status(201).json({
      success: true,
      message: "Bank account added successfully",
      bankAccounts: wallet.bankAccounts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
