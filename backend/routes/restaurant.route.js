import express from "express";
import {  getAllRestaurants, getRestaurantById, getRestaurantMenu } from "../contollers/restaurant.controller.js";
import upload from "../middleware/upload.js";


const restaurantRouter = express.Router();

restaurantRouter.get("/", getAllRestaurants);

restaurantRouter.get("/:id", getRestaurantById);

restaurantRouter.get("/:id/menu", getRestaurantMenu);

export default restaurantRouter;
