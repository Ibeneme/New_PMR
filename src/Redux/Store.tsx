import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/Auth';
import DeliveryParcel from './DeliverParcel/DeliverParcelSlice';
import apiSlice from './ExtraSlice/ExtraSlice';
import passengerRequestsSlice from './JoinRide/JoinRideSlice';
import offerRideSlice from './OfferRide/OfferRideSlice';
import sendParcelSlice from './SendParcel/SendParcelSlice';
import userSlice from './UserSlice/UserSlice';
// import postReducer from './Post/PostSlice'; // Assuming your postSlice is located here

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deliveryParcel: DeliveryParcel,
    api: apiSlice,
    passengerRequests: passengerRequestsSlice,
    offerRide: offerRideSlice,
    sendParcel: sendParcelSlice,
    user: userSlice,
   // posts: postReducer, // Add the posts reducer
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;