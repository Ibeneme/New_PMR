import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// Ensure this service is properly set up
import {RootState} from '../store';
import apiService from '../apiService';

const EXTRA_URL = '/api/drivers';

// Define TypeScript interfaces
interface OfferRide {
  _id: string;
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  price: number;
  date: string;
}

interface OfferRideState {
  rides: OfferRide[];
  selectedRide: OfferRide | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// **1. Fetch all offer rides**
export const fetchOfferRides = createAsyncThunk<
  OfferRide[],
  void,
  {rejectValue: string}
>('offerRide/fetchAll', async (_, {rejectWithValue}) => {
  try {
    const response = await apiService.get(EXTRA_URL);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **2. Fetch a specific offer ride by ID**
export const fetchOfferRideById = createAsyncThunk<
  OfferRide,
  string,
  {rejectValue: string}
>('offerRide/fetchById', async (id, {rejectWithValue}) => {
  try {
    const response = await apiService.get(`${EXTRA_URL}/${id}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **3. Fetch offer rides by user ID**
export const fetchOfferRidesByUserId = createAsyncThunk<
  OfferRide[],
  string,
  {rejectValue: string}
>('offerRide/fetchByUserId', async (userId, {rejectWithValue}) => {
  try {
    const response = await apiService.get(`${EXTRA_URL}/getByUserId/${userId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **4. Create a new offer ride**
export const createOfferRide = createAsyncThunk<
  OfferRide,
  OfferRide,
  {rejectValue: string}
>('offerRide/create', async (rideData, {rejectWithValue}) => {
  try {
    const response = await apiService.post(`${EXTRA_URL}/create`, rideData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **5. Update an offer ride**
export const updateOfferRide = createAsyncThunk<
  OfferRide,
  {id: string; rideData: Partial<OfferRide>},
  {rejectValue: string}
>('offerRide/update', async ({id, rideData}, {rejectWithValue}) => {
  try {
    const response = await apiService.put(`${EXTRA_URL}/${id}`, rideData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **6. Delete an offer ride**
export const deleteOfferRide = createAsyncThunk<
  string,
  string,
  {rejectValue: string}
>('offerRide/delete', async (id, {rejectWithValue}) => {
  try {
    await apiService.delete(`${EXTRA_URL}/${id}`);
    return id; // Return deleted ride ID
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Initial state
const initialState: OfferRideState = {
  rides: [],
  selectedRide: null,
  status: 'idle',
  error: null,
};

// Offer Ride Slice
const offerRideSlice = createSlice({
  name: 'offerRide',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOfferRides.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOfferRides.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rides = action.payload;
      })
      .addCase(fetchOfferRides.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch offer rides';
      })

      .addCase(fetchOfferRideById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOfferRideById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedRide = action.payload;
      })
      .addCase(fetchOfferRideById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Offer ride not found';
      })

      .addCase(fetchOfferRidesByUserId.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOfferRidesByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rides = action.payload;
      })
      .addCase(fetchOfferRidesByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'No offer rides found for this user';
      })

      .addCase(createOfferRide.pending, state => {
        state.status = 'loading';
      })
      .addCase(createOfferRide.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rides.push(action.payload);
      })
      .addCase(createOfferRide.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to create offer ride';
      })

      .addCase(updateOfferRide.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateOfferRide.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.rides.findIndex(
          ride => ride._id === action.payload._id,
        );
        if (index !== -1) {
          state.rides[index] = action.payload;
        }
      })
      .addCase(updateOfferRide.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to update offer ride';
      })

      .addCase(deleteOfferRide.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteOfferRide.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rides = state.rides.filter(ride => ride._id !== action.payload);
      })
      .addCase(deleteOfferRide.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to delete offer ride';
      });
  },
});

export default offerRideSlice.reducer;

// Selectors
// export const selectOfferRides = (state: RootState) => state.offerRide.rides;
// export const selectSelectedRide = (state: RootState) =>
//   state.offerRide.selectedRide;
// export const selectOfferRideStatus = (state: RootState) =>
//   state.offerRide.status;
// export const selectOfferRideError = (state: RootState) => state.offerRide.error;
