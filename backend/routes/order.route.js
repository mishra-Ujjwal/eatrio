import express from "express"
import isUser from "../middleware/isUser.js";
import { getOrderById, getUserOrders } from "../contollers/order.controller.js";
const orderRouter = express.Router()

orderRouter.get("/my-orders", isUser, getUserOrders);
orderRouter.get("/:id", isUser, getOrderById);

export default orderRouter;