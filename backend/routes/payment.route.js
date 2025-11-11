import express from "express";
import razorpay from "../config/razorpay.config.js";
import crypto from "crypto";
import Owner from "../models/owner.model.js";
import Restaurant from "../models/restaurant.model.js";
import orderModel from "../models/order.model.js";


const paymentRouter = express.Router();

// 💳 1️⃣ Create Razorpay Order
paymentRouter.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// ✅ 2️⃣ Verify Payment + Activate Subscription + Register Restaurant
paymentRouter.post("/verify-payment", async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      ownerData 
    } = req.body;

    // ✅ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Find the owner
    const owner = await Owner.findById(ownerData.ownerId);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    // ✅ Calculate plan duration
    const planDuration =
      ownerData.subscriptionPlan === "yearly"
        ? 365 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

    // ✅ Update subscription inside owner model
    owner.subscription = {
      active: true,
      plan: ownerData.subscriptionPlan,
      startDate: new Date(),
      endDate: new Date(Date.now() + planDuration),
      paymentId: razorpay_payment_id,
    };

    await owner.save();

    // ✅ Create restaurant only if not already created
    const existingRestaurant = await Restaurant.findOne({ owner: owner._id });

    let restaurant;
    if (!existingRestaurant) {
      restaurant = new Restaurant({
        name: ownerData.restaurantName,
        description: ownerData.description,
        image: ownerData.image,
        owner: owner._id,
      });

      await restaurant.save();

      // Link restaurant to owner
      owner.restaurant = restaurant._id;
      await owner.save();
    } else {
      restaurant = existingRestaurant;
    }

    res.status(200).json({
      success: true,
      message:
        "Payment verified successfully! Subscription activated and restaurant registered.",
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        subscription: owner.subscription,
        restaurant: owner.restaurant,
      },
      restaurant,
    });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({
      message: "Payment verification failed",
      error: err.message,
    });
  }
});

// for customer
// 🛒 Create Razorpay Order for Customer Checkout
paymentRouter.post("/create-order-customer", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: "cust_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      currency: "INR",
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay customer order error:", error);
    res.status(500).json({ message: "Unable to create Razorpay order" });
  }
});

// ✅ Verify Payment & Save Customer Order
paymentRouter.post("/verify-customer-payment", async (req, res) => {
  try {
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      restaurantId,
      items,
      totalPrice,
      pickupTable,   
     } = req.body;

    // 🧮 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 💾 Save order
    const newOrder = new orderModel({
      user: userId,
      restaurant: restaurantId,
      items,
      totalPrice,
      pickupTable,
      payment: {
        mode: "online",
        status: "completed",
        transactionId: razorpay_payment_id,
      },
      status: "pending",
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully and order placed!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Customer payment verification failed:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
});



export default paymentRouter;
