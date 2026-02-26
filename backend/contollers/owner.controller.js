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
      restaurant: null,
    });

    const token = generateToken(owner._id);

    const populatedOwner = await Owner.findById(owner._id).populate(
      "restaurant"
    );

    res.cookie("ownerToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
});

    res.json({
      success: true,
      message: "Owner registered successfully.",
      owner: {
        id: populatedOwner._id,
        name: populatedOwner.name,
        email: populatedOwner.email,
        restaurant: populatedOwner.restaurant,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Login Owner
export const ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Correct secure cookie settings for Render (HTTPS)
    res.cookie("ownerToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

    res.status(200).json({
      success: true,
      message: "Login successful",
      owner: { id: owner._id, name: owner.name, email: owner.email },
    });
  } catch (err) {
    console.error("Error during owner login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Logout Owner
export const logoutOwner = (req, res) => {
  res.cookie("ownerToken", "", {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(0),
  path:"/"
})
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
