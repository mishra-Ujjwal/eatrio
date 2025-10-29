import cloudinary from "../config/cloudinary.config.js";
import categoryModel from "../models/category.model.js";
import menuItemModel from "../models/menuItem.model.js";
import restaurantModel from "../models/restaurant.model.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find();
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params; // from /:id/menu

    // ✅ use the same variable name everywhere
    const restaurant = await restaurantModel.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // ✅ Fetch all categories for this restaurant
    const categories = await categoryModel.find({ restaurant: id });

    // ✅ For each category, fetch items
    const categoriesWithItems = await Promise.all(
      categories.map(async (cat) => {
        const items = await menuItemModel.find({ category: cat._id });
        return { ...cat.toObject(), items };
      })
    );

    res.status(200).json({
      success: true,
      restaurant,
      categories: categoriesWithItems,
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

