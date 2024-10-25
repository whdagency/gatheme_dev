import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// const transformIngredients = (ingredients) => {
//   return Object.values(ingredients || {}).flat().map(name => ({ name }));
// };



const transformIngredients = (ingredients) => {
  const values = Object.values(ingredients || {}).flat();
  return values.length ? values.map(name => ({ name })) : [];
};


// const transformtoppings = (toppings) => {
//   return Object.values(toppings || {}).flat().map(topping => ({
//     id: topping.id,
//     name: topping.name,
//     option: topping.option.map(opt => ({
//       name: opt.name,
//       price: opt.price
//     }))
//   }));
// };


const transformtoppings = (toppings) => {
  return Object.values(toppings || {}).flat().map(topping => ({
    id: topping.id,
    name: topping.name,
    option: Array.isArray(topping.option)
      ? topping.option.map(opt => ({
          name: opt.name,
          price: opt.price
        }))
      : [] // Retourne un tableau vide si `topping.option` est `undefined`
  }));
};


const initialState = {
  items: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};
// const transformPrices = (selectedPrices) => {
//   return Object.values(selectedPrices || {}).map(price => parseFloat(price));
// };

const transformPrices = (selectedPrices) => {
  const values = Object.values(selectedPrices || {});
  return values.length ? values.map(price => parseFloat(price)) : [];
};


const updateLocalStorage = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};




export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity, resto_id, toppings, comment, ingredients, extravariants, selectedPrices } = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);
      const transformedIngredients = transformIngredients(ingredients);
      const transformedToppings = transformtoppings(toppings);
      const transformedExtraToppings = transformtoppings(extravariants);
      const transformedPrices = transformPrices(selectedPrices);

     
console.log("transformedIngredients:", transformedIngredients);


console.log("transformedToppings:", transformedToppings);


console.log("transformedExtraToppings:", transformedExtraToppings);


console.log("transformedPrices:", transformedPrices);

      if (existingIndex >= 0) {
        if (comment != "") {
          state.items.push({ ...product, quantity, resto_id, comment, toppings: transformedToppings, ingredients: transformedIngredients, extravariants: transformedExtraToppings, selectedPrices: selectedPrices });
        }
        else if (Object.keys(ingredients).length > 0 || Object.keys(extravariants).length > 0 || Object.keys(toppings).length > 0) {
          state.items.push({ ...product, quantity, resto_id, comment, toppings: transformedToppings, ingredients: transformedIngredients, extravariants: transformedExtraToppings, selectedPrices: selectedPrices });
        }
        else {
          state.items[existingIndex].quantity += quantity;
          state.items[existingIndex].toppings = transformedToppings;
          state.items[existingIndex].ingredients = transformedIngredients;
          state.items[existingIndex].extravariants = transformedExtraToppings;
          state.items[existingIndex].selectedPrices = transformedPrices;
        }
      } else {
        state.items.push({ ...product, quantity, resto_id, comment: comment, toppings: transformedToppings, ingredients: transformedIngredients, extravariants: transformedExtraToppings, selectedPrices: selectedPrices });
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