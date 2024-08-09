import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const transformIngredients = (ingredients) => {
  return Object.values(ingredients).flat().map(name => ({ name }));
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
      const { product, quantity, resto_id, comment, toppings , ingredients, extravariants } = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);
      const transformedIngredients = transformIngredients(ingredients);

      if (existingIndex >= 0) {
        if(comment != "")
        {
          state.items.push({ ...product, quantity, resto_id, comment, toppings, ingredients: transformedIngredients , extravariants});
        }
        else{
          state.items[existingIndex].quantity += quantity;
          state.items[existingIndex].toppings = toppings;
          state.items[existingIndex].extravariants = extravariants;
          state.items[existingIndex].ingredients = transformedIngredients;
        }
      } else {
        state.items.push({ ...product, quantity, resto_id, comment, toppings, ingredients: transformedIngredients, extravariants});
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
