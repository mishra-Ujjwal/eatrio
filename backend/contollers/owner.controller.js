import Owner from "../models/owner.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper to create JWT
const generateToken = (ownerId) => {
  return jwt.sign({ id: ownerId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register Owner
export const registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner)
      return res.status(400).json({ message: "Owner already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      subscription: { active: false, plan: null },
      restaurant: null, // initially no restaurant linked
    });

    const token = generateToken(owner._id);

    const populatedOwner = await Owner.findById(owner._id).populate("restaurant");

    res
      .cookie("ownerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message:
          "Owner registered successfully. Complete payment to activate subscription.",
        owner: {
          id: populatedOwner._id,
          name: populatedOwner.name,
          email: populatedOwner.email,
          restaurant: populatedOwner.restaurant, // ✅ send restaurant (null for now)
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Login Owner
export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // ✅ populate restaurant on login
    const owner = await Owner.findOne({ email }).populate("restaurant");

    if (!owner)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(owner._id);

    // check if subscription expired
    if (
      owner.subscription.active &&
      new Date() > new Date(owner.subscription.endDate)
    ) {
      owner.subscription.active = false;
      await owner.save();
      return res.status(403).json({
        message: "Your subscription has expired. Please renew to log in.",
      });
    }

    res
      .cookie("ownerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        owner: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
          subscription: owner.subscription,
          restaurant: owner.restaurant, // ✅ include linked restaurant
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Logout Owner
export const logoutOwner = (req, res) => {
  res
    .cookie("ownerToken", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
