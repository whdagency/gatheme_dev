import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const transformIngredients = (ingredients) => {
  return Object.values(ingredients).flat().map(name => ({ name }));
};
const transformtoppings = (toppings) => {
  return Object.values(toppings).flat().map(topping => ({
    id: topping.id,
    name: topping.name,
    option: topping.option.map(opt => ({
      name: opt.name,
      price: opt.price
    }))
  }));
};
const initialState = {
  items: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};
const updateLocalStorage = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity, resto_id, toppings , ingredients, extravariants  } = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);
      const transformedIngredients = transformIngredients(ingredients);
      const transformedToppings = transformtoppings(toppings);
      const transformedExtraToppings = transformtoppings(extravariants);
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
        state.items[existingIndex].toppings = transformedToppings;
        state.items[existingIndex].ingredients = transformedIngredients;
        state.items[existingIndex].extravariants = transformedExtraToppings;
      } else {
        state.items.push({ ...product, quantity, resto_id, toppings: transformedToppings, ingredients: transformedIngredients,extravariants:  transformedExtraToppings});
      }
      updateLocalStorage(state.items);
    },
    incrementQuantity: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index >= 0) {
        state.items[index].quantity += 1;
        updateLocalStorage(state.items);
      }
    },
    decrementQuantity: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index >= 0 && state.items[index].quantity > 1) {
        state.items[index].quantity -= 1;
        updateLocalStorage(state.items);
      }
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index >= 0) {
        state.items.splice(index, 1);
        updateLocalStorage(state.items);
      }
    },
    removeAll: (state) => {
      state.items = [];
      updateLocalStorage(state.items);
    }
  },
  extraReducers: (builder) => {
    // Handle asynchronous actions here if needed, for example:
    // builder
    //   .addCase(fetchCartItems.pending, (state) => {
    //     state.status = 'loading';
    //   })
    //   .addCase(fetchCartItems.fulfilled, (state, action) => {
    //     state.status = 'succeeded';
    //     state.items = action.payload;
    //     updateLocalStorage(state.items);
    //   })
    //   .addCase(fetchCartItems.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.error.message;
    //   });
  }
});
export const { addItem, incrementQuantity, decrementQuantity, removeItem, removeAll } = cartSlice.actions;
export default cartSlice.reducer;