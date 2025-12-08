import express from "express";
import Wallet from "../models/wallet.model.js";
import { ownerWithdraw } from "../contollers/withdrawl.controller.js";
import { addBankAccount } from "../contollers/wallet.controller.js";



const walletRouter = express.Router();

// =============== GET WALLET ===============
walletRouter.get("/:restaurantId", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ restaurantId: req.params.restaurantId });
    if (!wallet)
      return res.status(404).json({ success: false, message: "Wallet not found" });

    res.json({ success: true, wallet });
  } catch (err) {
    res.json({ success: false, message: "Error fetching wallet" });
  }
});

// =============== GET ALL BANK ACCOUNTS ===============
walletRouter.get("/:restaurantId/banks", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ restaurantId: req.params.restaurantId });
    res.json({ success: true, bankAccounts: wallet.bankAccounts });
  } catch (err) {
    res.json({ success: false });
  }
});

// =============== ADD BANK ACCOUNT ===============
walletRouter.post("/add-bank", addBankAccount);

// =============== DELETE BANK ACCOUNT ===============
walletRouter.delete("/:restaurantId/bank/:bankId", async (req, res) => {
  try {
    const { restaurantId, bankId } = req.params;

    const wallet = await Wallet.findOne({ restaurantId });

    wallet.bankAccounts = wallet.bankAccounts.filter(
      (b) => b._id.toString() !== bankId
    );

    await wallet.save();

    res.json({ success: true, bankAccounts: wallet.bankAccounts });
  } catch (err) {
    res.json({ success: false });
  }
});

// =============== WITHDRAW ===============
walletRouter.post("/withdraw", ownerWithdraw);

export default walletRouter;
