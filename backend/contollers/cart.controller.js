import Cart from "../models/cart.model.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { restaurantId, name, price, image } = req.body;
    const userId = req.userId;

    let cart = await Cart.findOne({ userId, restaurantId });

    if (!cart) {
      cart = new Cart({ userId, restaurantId, items: [{ name, price, image, quantity: 1 }] });
    } else {
      const existing = cart.items.find((i) => i.name === name);
      if (existing) existing.quantity += 1;
      else cart.items.push({ name, price, image, quantity: 1 });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { restaurantId, name } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId, restaurantId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const idx = cart.items.findIndex((i) => i.name === name);
    if (idx === -1) return res.status(404).json({ success: false, message: "Item not found" });

    if (cart.items[idx].quantity > 1) cart.items[idx].quantity -= 1;
    else cart.items.splice(idx, 1);

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get cart by restaurant
export const getCart = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId, restaurantId });
    if (!cart) return res.json({ success: true, cart: { items: [] } });

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Clear cart for restaurant
export const clearCart = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.userId;

    await Cart.deleteOne({ userId, restaurantId });
    res.json({ success: true, cart: { items: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
