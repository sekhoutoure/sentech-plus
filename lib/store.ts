import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'
import wishlistReducer from './features/wishlist/wishlistSlice'
import siteSettingsReducer from './features/siteSettings/siteSettingsSlice'
import userReducer from './features/user/userSlice'
import compareReducer from './features/compare/compareSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      product: productReducer,
      address: addressReducer,
      rating: ratingReducer,
      wishlist: wishlistReducer,
      siteSettings: siteSettingsReducer,
      user: userReducer,
      compare: compareReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
