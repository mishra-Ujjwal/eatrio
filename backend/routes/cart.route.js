import express from "express";
import isUser from "../middleware/isUser.js";
import { addToCart, clearCart, getCart, removeFromCart } from "../contollers/cart.controller.js";


const cartRouter = express.Router();

cartRouter.post("/add", isUser, addToCart);
cartRouter.post("/remove", isUser, removeFromCart);
cartRouter.get("/:restaurantId", isUser, getCart);
cartRouter.delete("/clear/:restaurantId", isUser, clearCart);

export default cartRouter;
