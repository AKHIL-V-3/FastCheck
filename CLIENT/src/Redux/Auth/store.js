import { configureStore } from '@reduxjs/toolkit';
import {userReducer} from './authSlice';
import { persistReducer,persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import storage from 'reduxjs-toolkit-persist/lib/storage/session'


const persistConfig = {
          key:"HotelBookingpersistsecretkey",
          storage
}
const persistAuthReducer = persistReducer(persistConfig,userReducer)

const store = configureStore({
  reducer: {
    user: persistAuthReducer,
    // Add any other slices of the Redux store here
  },
  
})
export default store;
export const persistedStore = persistStore(store)
