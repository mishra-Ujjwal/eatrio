import { addCategory, addMenuItem, deleteCategory, deleteMenuItem, getAllCategories, getItemsByCategory, toggleMenuItemAvailability, updateCategory, updateMenuItem } from "../contollers/menu.controller.js";
import express from "express";
import upload from "../middleware/upload.js";
const menuRouter = express.Router();
menuRouter.post("/addcategory", upload.single("image"), addCategory);
menuRouter.get("/getcategory/:restaurantId",getAllCategories);
menuRouter.post(
  "/:id/add-menu-item",
  upload.fields([
    { name: "image", maxCount: 1 }, // main item image
    { name: "addonsImages[0]" },
    { name: "addonsImages[1]" },
    { name: "addonsImages[2]" },
  ]),
  addMenuItem
);
menuRouter.get("/getitems/:categoryId", getItemsByCategory);
menuRouter.put("/updatecategory/:id", upload.single("image"), updateCategory);
menuRouter.delete("/deletecategory/:id", deleteCategory);
menuRouter.put(
  "/updatemenuitem/:id",
  upload.fields([
    { name: "image", maxCount: 1 }, // main image
    { name: "addonsImages[0]" },
    { name: "addonsImages[1]" },
    { name: "addonsImages[2]" }, // add more if you support more addons
  ]),
  updateMenuItem
);


// 🔹 Delete menu item
menuRouter.delete("/deletemenuitem/:id", deleteMenuItem); 
menuRouter.put("/toggle-availability/:id", toggleMenuItemAvailability);
export default menuRouter;
