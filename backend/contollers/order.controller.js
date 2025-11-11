import Order from "../models/order.model.js";

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("restaurant", "name image")
      .lean();

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get single order details
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate("restaurant", "name image")
      .lean();

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};