import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products: [],
        quantity: 0,
        total: 0,
    },
    reducers: {
        addProduct: (state, action) => {
            // Check if product already exists with same id, size, and color
            const existingProductIndex = state.products.findIndex(
                (product) =>
                    product._id === action.payload._id &&
                    product.size === action.payload.size &&
                    product.color === action.payload.color
            );

            if (existingProductIndex >= 0) {
                // Product already exists, increase quantity
                state.products[existingProductIndex].quantity += action.payload.quantity;
                state.quantity += action.payload.quantity;
                state.total += action.payload.price * action.payload.quantity;
            } else {
                // New product, add to cart
                state.quantity += action.payload.quantity; // FIX: Add the actual quantity, not just 1
                state.products.push(action.payload);
                state.total += action.payload.price * action.payload.quantity;
            }
        },

        increaseQuantity: (state, action) => {
            const productIndex = state.products.findIndex(
                (product) =>
                    product._id === action.payload.id &&
                    product.size === action.payload.size &&
                    product.color === action.payload.color
            );

            if (productIndex >= 0) {
                state.products[productIndex].quantity += 1;
                state.quantity += 1;
                state.total += state.products[productIndex].price;
            }
        },

        decreaseQuantity: (state, action) => {
            const productIndex = state.products.findIndex(
                (product) =>
                    product._id === action.payload.id &&
                    product.size === action.payload.size &&
                    product.color === action.payload.color
            );

            if (productIndex >= 0) {
                const product = state.products[productIndex];

                if (product.quantity > 1) {
                    // Decrease quantity by 1
                    product.quantity -= 1;
                    state.quantity -= 1;
                    state.total -= product.price;
                } else {
                    // Remove product completely if quantity is 1
                    state.quantity -= 1;
                    state.total -= product.price;
                    state.products.splice(productIndex, 1);
                }
            }
        },

        removeProduct: (state, action) => {
            // FIX: Use _id instead of id for consistency
            const productIndex = state.products.findIndex(
                product => 
                    product._id === action.payload._id &&
                    product.size === action.payload.size &&
                    product.color === action.payload.color
            );
            
            if (productIndex >= 0) {
                const product = state.products[productIndex];
                state.quantity -= product.quantity;
                state.total -= product.price * product.quantity;
                state.products.splice(productIndex, 1);
            }
        },

        clearCart: (state) => {
            state.products = [];
            state.quantity = 0;
            state.total = 0;
        },

    },
});

export const { 
    addProduct, 
    increaseQuantity, 
    decreaseQuantity, 
    removeProduct, 
    clearCart, 
    syncCart 
} = cartSlice.actions;

export default cartSlice.reducer;