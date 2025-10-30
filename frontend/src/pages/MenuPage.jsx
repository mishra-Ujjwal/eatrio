import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import AddCategoryForm from "./Restaurant/AddCategoryForm.jsx";
import EditCategoryForm from "./Restaurant/EditCategoryForm.jsx";
import AddMenuItem from "./AddMenuItem.jsx";
import EditMenuItem from "./Restaurant/EditMenuItem.jsx";
import { capitalizeFirstLetter } from "../utils/CapitalizeFirstLetter.js";

const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [menuItemToEdit, setMenuItemToEdit] = useState(null);

  const owner = useSelector((state) => state.owner.ownerData);

  const restaurantId = owner.restaurant._id;
  console.log(restaurantId)
   

  // Fetch all categories
  const getAllCategories = async () => {
    if (!restaurantId) return;
    setLoadingCategories(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/menu/getcategory/${restaurantId}`);
      setCategories(res.data.categories || []);
      setSelectedCategory(res.data.categories[0])
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch items by category
  const getItemsByCategory = async (categoryId) => {
    if (!categoryId) return;
    setLoadingItems(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/menu/getitems/${categoryId}`);
      setMenuItems(res.data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getItemsByCategory(selectedCategory._id);
    } else {
      setMenuItems([]);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    getItemsByCategory(category._id);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/menu/deletecategory/${categoryId}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      if (selectedCategory?._id === categoryId) {
        setSelectedCategory(null);
        setMenuItems([]);
      }
      alert("Category deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete category");
    }
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setShowEditCategory(true);
  };

  const handleEditMenuItem = (item) => {
    setMenuItemToEdit(item);
    setShowEditItem(true);
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/menu/deletemenuitem/${itemId}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
      alert("Menu item deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete menu item");
    }
  };

  // Toggle availability
  const toggleAvailability = async (itemId) => {
    try {
      const item = menuItems.find((i) => i._id === itemId);
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/menu/updatemenuitem/${itemId}`, {
        available: !item.available,
      });
      setMenuItems((prev) =>
        prev.map((i) => (i._id === itemId ? { ...i, available: !i.available } : i))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update availability");
    }
  };

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Menu Categories</h2>
          <p className="text-gray-500">Manage your restaurant’s menu</p>
        </div>
        <div
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 !bg-green-800 text-white px-2  text-center py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
       Add Category
        </div>
      </div>

      {/* Category List */}
      <div className="flex gap-5 overflow-x-auto pb-4">
        {loadingCategories
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[220px] p-4 rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
                <div className="w-40 h-40 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          : categories.length > 0
          ? categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleCategoryClick(cat)}
                className={`min-w-[180px] relative flex-shrink-0 p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                  selectedCategory?._id === cat._id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                }`}
              >
                <img src={cat.image} alt={cat.name} className="w-30 h-30 rounded-lg object-cover mb-3" />
                <p className="text-2xl font-semibold text-gray-800">{capitalizeFirstLetter(cat.name)}</p>

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }} className="p-1 bg-green-100 rounded-lg hover:bg-green-200">
                    <FaEdit className="text-green-600" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id); }} className="p-1 bg-red-100 rounded-lg hover:bg-red-200">
                    <FaTrash className="text-red-600" />
                  </button>
                </div>
              </div>
            ))
          : <p className="text-gray-500">No categories found.</p>}
      </div>

      {/* Menu Items */}
      {selectedCategory && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{capitalizeFirstLetter(selectedCategory.name)} Items</h2>
              <p className="text-gray-500">Manage all items in this category</p>
            </div>
            <button onClick={() => setShowAddItem(true)} className="flex items-center gap-2 !bg-green-800 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingItems
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              : menuItems.length > 0
              ? menuItems.map((item) => (
                  <div key={item._id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 relative">
                    <img src={item.image} alt={item.name} className="w-32 h-32 rounded-lg object-cover mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-green-600 font-semibold">₹{item.price}</p>

                    {/* Availability */}
                    <div className="mt-2 flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={item.available} onChange={() => toggleAvailability(item._id)} className="w-5 h-5 accent-green-600 cursor-pointer" />
                        <span className={`font-medium ${item.available ? "text-gray-800" : "text-red-600 opacity-70"}`}>
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </label>
                    </div>

                    {/* Addons */}
                    {item.addons && item.addons.length > 0 && (
                      <div className="mt-3 border-t pt-2">
                        <p className="text-gray-600 font-medium mb-2">Addons:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.addons.map((addon, idx) => (
                            <div key={idx} className="flex items-center gap-2 border rounded-lg p-2 bg-gray-50">
                              {addon.image && <img src={addon.image} alt={addon.title} className="w-10 h-10 rounded-lg object-cover" />}
                              <div>
                                <p className="text-gray-800 font-semibold">{addon.title}</p>
                                <p className="text-green-600 text-sm">₹{addon.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Edit/Delete */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button onClick={() => handleEditMenuItem(item)} className="p-1 bg-green-100 rounded-lg hover:bg-green-200">
                        <FaEdit className="text-green-600" />
                      </button>
                      <button onClick={() => handleDeleteMenuItem(item._id)} className="p-1 bg-red-100 rounded-lg hover:bg-red-200">
                        <FaTrash className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
              : <p className="text-gray-500">No items in this category.</p>}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddCategory && (
        <Modal onClose={() => setShowAddCategory(false)}>
          <AddCategoryForm restaurantId={restaurantId} close={() => { setShowAddCategory(false); getAllCategories(); }} />
        </Modal>
      )}

      {showEditCategory && categoryToEdit && (
        <Modal onClose={() => setShowEditCategory(false)}>
          <EditCategoryForm category={categoryToEdit} refresh={getAllCategories} onClose={() => setShowEditCategory(false)} />
        </Modal>
      )}

      {showAddItem && selectedCategory && (
        <Modal onClose={() => setShowAddItem(false)}>
          <AddMenuItem categoryId={selectedCategory._id} close={() => { setShowAddItem(false); getItemsByCategory(selectedCategory._id); }} />
        </Modal>
      )}

      {showEditItem && menuItemToEdit && (
        <Modal onClose={() => setShowEditItem(false)}>
          <EditMenuItem item={menuItemToEdit} close={() => setShowEditItem(false)} refresh={() => getItemsByCategory(selectedCategory._id)} />
        </Modal>
      )}
    </section>
  );
};

// Modal Component (lock scroll)
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-start overflow-auto pt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">✕</button>
        {children}
      </div>
    </div>
  );
};

export default MenuPage;
