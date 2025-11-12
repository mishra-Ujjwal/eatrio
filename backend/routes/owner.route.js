import express from "express";
import { logoutOwner, ownerLogin, registerOwner } from "../contollers/owner.controller.js";
import { protectOwner } from "../middleware/protectOwner.js";
import ownerModel from "../models/owner.model.js";


const ownerRouter = express.Router();
ownerRouter.post("/register", registerOwner);
ownerRouter.post("/login", ownerLogin);
ownerRouter.post("/logout", logoutOwner);
ownerRouter.get("/me", protectOwner, async (req, res) => {
  try {
    const owner = await ownerModel.findById(req.owner._id)
      .select("-password")
      .populate("restaurant");

    res.status(200).json({ success: true, owner });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch owner data" });
  }
});

export default ownerRouter;