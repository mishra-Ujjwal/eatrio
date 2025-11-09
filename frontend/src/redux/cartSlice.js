import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// --- Async Thunks ---

export const fetchCartDB = createAsyncThunk(
  "cart/fetchCartDB",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/user-cart/${restaurantId}`, {
        withCredentials: true,
      });
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const addToCartDB = createAsyncThunk(
  "cart/addToCartDB",
  async (item, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/user-cart/add`, item, {
        withCredentials: true,
      });
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const removeFromCartDB = createAsyncThunk(
  "cart/removeFromCartDB",
  async ({ restaurantId, name }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user-cart/remove`,
        { restaurantId, name },
        { withCredentials: true }
      );
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const clearCartDB = createAsyncThunk(
  "cart/clearCartDB",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/user-cart/clear/${restaurantId}`, {
        withCredentials: true,
      });
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

// --- Local Storage Helpers ---
const saveToLocalStorage = (items, restaurant) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
  localStorage.setItem("cartRestaurant", JSON.stringify(restaurant));
};

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
  restaurant: JSON.parse(localStorage.getItem("cartRestaurant")) || null,
  loading: false,
  error: null,
};

// --- Slice ---
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartLocal: (state, action) => {
      const existing = state.items.find((i) => i.name === action.payload.name);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
      saveToLocalStorage(state.items, state.restaurant);
    },
    removeFromCartLocal: (state, action) => {
      const index = state.items.findIndex((i) => i.name === action.payload);
      if (index !== -1) {
        if (state.items[index].quantity > 1) state.items[index].quantity -= 1;
        else state.items.splice(index, 1);
      }
      saveToLocalStorage(state.items, state.restaurant);
    },
    clearCartLocal: (state) => {
      state.items = [];
      state.restaurant = null;
      saveToLocalStorage(state.items, state.restaurant);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCartDB
      .addCase(fetchCartDB.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartDB.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.restaurant = action.payload?.restaurantId || null;
        saveToLocalStorage(state.items, state.restaurant);
      })
      .addCase(fetchCartDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })
      // addToCartDB
      .addCase(addToCartDB.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.restaurant = action.payload?.restaurantId || null;
        saveToLocalStorage(state.items, state.restaurant);
      })
      // removeFromCartDB
      .addCase(removeFromCartDB.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.restaurant = action.payload?.restaurantId || null;
        saveToLocalStorage(state.items, state.restaurant);
      })
      // clearCartDB
      .addCase(clearCartDB.fulfilled, (state) => {
        state.items = [];
        state.restaurant = null;
        saveToLocalStorage(state.items, state.restaurant);
      });
  },
});

export const { addToCartLocal, removeFromCartLocal, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
