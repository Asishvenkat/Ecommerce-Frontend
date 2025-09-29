// redux/wishlistRedux.js
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    products: [],
    quantity: 0,
  },
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existingItem = state.products.find(
        (product) => product._id === item._id
      );
      
      if (!existingItem) {
        state.products.push(item);
        state.quantity += 1;
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.products.findIndex(
        (product) => product._id === productId
      );
      
      if (itemIndex !== -1) {
        state.products.splice(itemIndex, 1);
        state.quantity -= 1;
      }
    },
    clearWishlist: (state) => {
      state.products = [];
      state.quantity = 0;
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;