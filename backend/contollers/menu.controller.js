
import Category from "../models/category.model.js";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinary.config.js";
import menuItemModel from "../models/menuItem.model.js";
import restaurantModel from "../models/restaurant.model.js";

// Add Category Controller
export const addCategory = async (req, res) => {
  try {
    const { name, description, restaurantId } = req.body;

    if (!name || !restaurantId) {
      return res.status(400).json({ message: "Name and restaurant ID are required" });
    }

    let imageUrl = "";

    if (req.file) {
      // Convert buffer to base64 for Cloudinary upload
      const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64String, {
        folder: "restaurant_categories",
      });

      imageUrl = uploadResponse.secure_url;
    }

    const category = new Category({
      name,
      description,
      restaurant: restaurantId,
      image: imageUrl,
    });

    await category.save();

    res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params; // optional query param to filter by restaurant
    let filter = {};
    if (restaurantId) {
      filter.restaurant = restaurantId;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const addMenuItem = async (req, res) => {
  try {
    const { id } = req.params; // restaurant ID
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    // ✅ Main Image
    let imageUrl = "";
    if (req.files?.image && req.files.image[0]) {
      const file = req.files.image[0];
      const fileBase64 = file.buffer.toString("base64");
      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${fileBase64}`,
        { folder: "menuItems" }
      );
      imageUrl = uploadResult.secure_url;
    }

    // ✅ Optional Addons
    let addons = [];
    if (req.body.addons) {
      let parsedAddons = [];
      try {
        parsedAddons = JSON.parse(req.body.addons);
      } catch (err) {
        return res.status(400).json({ message: "Invalid addons format" });
      }

      for (let i = 0; i < parsedAddons.length; i++) {
        let addonImageUrl = "";
        const addonFileKey = `addonsImages[${i}]`;

        if (req.files?.[addonFileKey] && req.files[addonFileKey][0]) {
          const file = req.files[addonFileKey][0];
          const fileBase64 = file.buffer.toString("base64");
          const uploadResult = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${fileBase64}`,
            { folder: "menuAddons" }
          );
          addonImageUrl = uploadResult.secure_url;
        }

        addons.push({
          title: parsedAddons[i].title,
          price: parsedAddons[i].price,
          image: addonImageUrl,
        });
      }
    }

    // ✅ Save Menu Item
    const newItem = new menuItemModel({
      restaurant: id,
      name,
      description,
      price,
      category,
      image: imageUrl,
      addons,
    });

    await newItem.save();

    // ✅ Push the new menu item into the restaurant’s menu array
    await restaurantModel.findByIdAndUpdate(
      id,
      { $push: { menu: newItem._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Menu item added successfully and linked to restaurant!",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Error adding menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Optional: validate category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch all menu items in this category
    const items = await menuItemModel.find({ category: categoryId, available: true })
      .populate("restaurant") 
      .populate("category");

    res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Category ID
    const { name, description } = req.body;

    // 🔍 Find the category first
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // ✏️ Update text fields
    if (name) category.name = name;
    if (description) category.description = description;

    // 🖼 If a new image file is uploaded
    if (req.file) {
      // 🧹 Delete old image from Cloudinary (if it exists)
      if (category.image) {
        try {
          // Extract public_id from Cloudinary image URL
          const parts = category.image.split("/");
          const publicIdWithExt = parts[parts.length - 1]; // e.g. abc123.jpg
          const publicId = publicIdWithExt.split(".")[0];
          await cloudinary.uploader.destroy(`restaurant_categories/${publicId}`);
        } catch (err) {
          console.warn("⚠️ Cloudinary delete failed (image might not exist):", err.message);
        }
      }

      // 🆕 Upload new image
      const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64String, {
        folder: "restaurant_categories",
      });
      category.image = uploadResponse.secure_url;
    }

    // 💾 Save updated category
    await category.save();

    res.status(200).json({
      success: true,
      message: "✅ Category updated successfully!",
      category,
    });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // ✅ Delete Cloudinary image if it exists
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`restaurant_categories/${publicId}`);
    }

    // ✅ Optional: delete all menu items under this category
    await menuItemModel.deleteMany({ category: id });

    // ✅ Delete category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "🗑 Category and its menu items deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params; // menu item id
    const { name, description, price, addons } = req.body; // addons as JSON string

    const item = await menuItemModel.findById(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // Update main fields
    if (name) item.name = name;
    if (description) item.description = description;
    if (price) item.price = price;

    // Update main image
    if (req.files?.image && req.files.image[0]) {
      if (item.image) {
        const publicId = item.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`menuItems/${publicId}`);
      }
      const file = req.files.image[0];
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(base64String, { folder: "menuItems" });
      item.image = uploadResult.secure_url;
    }

    // Handle addons
    if (addons) {
      const parsedAddons = JSON.parse(addons); // [{ title, price, _id?, imageChanged }]
      const updatedAddons = [];

      for (let i = 0; i < parsedAddons.length; i++) {
        const addon = parsedAddons[i];

        let addonImageUrl = addon.image || ""; // keep existing if not updated

        const addonFileKey = `addonsImages[${i}]`;
        if (req.files?.[addonFileKey] && req.files[addonFileKey][0]) {
          // Replace image if new file uploaded
          addonImageUrl = await (async () => {
            // delete old image if exists
            if (addon.image) {
              const publicId = addon.image.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(`menuAddons/${publicId}`);
            }
            const file = req.files[addonFileKey][0];
            const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
            const uploadResult = await cloudinary.uploader.upload(base64String, { folder: "menuAddons" });
            return uploadResult.secure_url;
          })();
        }

        // Only add valid addons
        if (addon.title && addon.price) {
          updatedAddons.push({
            _id: addon._id || undefined, // keep existing ID if any
            title: addon.title,
            price: addon.price,
            image: addonImageUrl,
          });
        }
      }

      item.addons = updatedAddons; // replace addons with updated list
    }

    await item.save();
    res.status(200).json({ success: true, message: "Menu item updated!", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await menuItemModel.findById(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    if (item.image) {
      const publicId = item.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`menuItems/${publicId}`);
    }

    await menuItemModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Menu item deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const toggleMenuItemAvailability = async (req, res) => {
  try {
    const { id } = req.params; // menu item ID
    const item = await menuItemModel.findById(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // Toggle available status
    item.available = !item.available;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Menu item is now ${item.available ? "available" : "unavailable"}`,
      item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
