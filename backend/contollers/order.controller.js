import Order from "../models/order.model.js";
import restaurantModel from "../models/restaurant.model.js";

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
export const getRestaurantOrders = async (req, res) => {
  try {
    const ownerId = req.owner._id;

    // 🏪 Find restaurant(s) owned by this owner
    const restaurants = await restaurantModel.find({ owner: ownerId }).select("_id");

    if (!restaurants.length)
      return res.status(404).json({ success: false, message: "No restaurant found for this owner" });

    // 🧾 Fetch all orders linked to those restaurant IDs
    const restaurantIds = restaurants.map((r) => r._id);

    const orders = await Order.find({ restaurant: { $in: restaurantIds } })
      .populate("user", "name email")
      .populate("restaurant", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Error fetching restaurant orders:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching restaurant orders",
    });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};