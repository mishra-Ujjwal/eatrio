import Wallet from "../models/wallet.model.js";

export const addBankAccount = async (req, res) => {
  try {
    const {
      restaurantId,
      accountHolderName,
      accountNumber,
      ifsc,
      bankName,
      panNumber,
      makeDefault,
    } = req.body;

    const wallet = await Wallet.findOne({ restaurantId });
    if (!wallet)
      return res.json({ success: false, message: "Wallet not found" });

    // remove default from others
    if (makeDefault) {
      wallet.bankAccounts.forEach((b) => (b.isDefault = false));
    }

    wallet.bankAccounts.push({
      accountHolderName,
      accountNumber,
      ifsc,
      bankName,
      panNumber,
      isDefault: makeDefault || false,
    });

    await wallet.save();

    res.json({
      success: true,
      bankAccounts: wallet.bankAccounts,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const ownerWithdraw = async (req, res) => {
  try {
    const { restaurantId, amount } = req.body;

    const wallet = await Wallet.findOne({ restaurantId });
    if (!wallet)
      return res.json({ success: false, message: "Wallet not found" });

    if (wallet.bankAccounts.length === 0)
      return res.json({ success: false, message: "Add bank first" });

    const defaultBank = wallet.bankAccounts.find((b) => b.isDefault);
    if (!defaultBank)
      return res.json({ success: false, message: "Set a default bank" });

    if (wallet.availableBalance < Number(amount))
      return res.json({ success: false, message: "Insufficient balance" });

    wallet.availableBalance -= Number(amount);
    wallet.withdrawnTotal += Number(amount);

    wallet.withdrawHistory.push({
      amount: Number(amount),
      status: "success",
      date: new Date(),
      bankUsed: defaultBank,
    });

    await wallet.save();

    res.json({ success: true, message: "Withdrawal successful", wallet });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
