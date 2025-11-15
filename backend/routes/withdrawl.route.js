import express from "express";
import { ownerWithdraw, getOwnerWithdrawHistory, getOwnerLastWithdrawal } from "../contollers/withdrawl.controller.js";

import { protectOwner } from "../middleware/protectOwner.js";

const withdrawlRouter = express.Router();

// Owner Withdraw
withdrawlRouter.post("/", protectOwner, ownerWithdraw);

// History
withdrawlRouter.get("/history", protectOwner, getOwnerWithdrawHistory);

// Last transaction
withdrawlRouter.get("/last", protectOwner, getOwnerLastWithdrawal);

export default withdrawlRouter;