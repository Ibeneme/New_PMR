import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiService from '../apiService';

// Initial state
interface PairedDriverState {
  pairedDriver: object | null;
  loading: boolean;
  error: string | null;
}

const initialState: PairedDriverState = {
  pairedDriver: null,
  loading: false,
  error: null,
};

// **Set Price**
export const setPriceForRequest = createAsyncThunk(
  'pairedDriver/setPriceForRequest',
  async ({id, price}: {id: string; price: number}, thunkAPI) => {
    try {
      const response = await apiService.put(
        `/api/auth/paired-driver/set-price/`,
        {price, id},
      );
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to set price.',
      );
    }
  },
);

// **Update Ride Status**
export const updateRideStatus = createAsyncThunk(
  'pairedDriver/updateRideStatus',
  async ({id, status}: {id: string; status: string}, thunkAPI) => {
    try {
      const response = await apiService.put(
        `/api/auth/paired-driver/update-ride-status/${id}`,
        {status},
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update ride status.',
      );
    }
  },
);

// **PairedDriver Slice**
const pairedDriverSlice = createSlice({
  name: 'pairedDriver',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Set Price
    builder
      .addCase(setPriceForRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setPriceForRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pairedDriver = action.payload.pairedDriver;
        state.error = null;
      })
      .addCase(setPriceForRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Ride Status
    builder
      .addCase(updateRideStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRideStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.pairedDriver = action.payload.pairedDriver;
        state.error = null;
      })
      .addCase(updateRideStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pairedDriverSlice.reducer;
