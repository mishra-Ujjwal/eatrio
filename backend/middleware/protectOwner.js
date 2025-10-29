import jwt from "jsonwebtoken";
import Owner from "../models/owner.model.js";

// ✅ Protect routes
export const protectOwner = async (req, res, next) => {
  let token = req.cookies?.ownerToken; // read from cookie

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.owner = await Owner.findById(decoded.id).select("-password");
    if (!req.owner) return res.status(401).json({ message: "Owner not found" });
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
