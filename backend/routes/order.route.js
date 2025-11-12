import express from "express"
import isUser from "../middleware/isUser.js";
import { getOrderById, getRestaurantOrders, getUserOrders, updateOrderStatus } from "../contollers/order.controller.js";
import { protectOwner } from "../middleware/protectOwner.js";
const orderRouter = express.Router()

orderRouter.get("/my-orders", isUser, getUserOrders);
orderRouter.get("/restaurant-orders", protectOwner, getRestaurantOrders);
orderRouter.get("/:id", isUser, getOrderById);
orderRouter.put("/:orderId/status", protectOwner, updateOrderStatus);

export default orderRouter;