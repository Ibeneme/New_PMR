import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import apiService from '../apiService'; // Ensure this is correctly set up

// Define the DeliveryParcel type
interface DeliveryParcel {
  _id: string;
  destination: string;
  country: string;
  state: string;
  city: string;
  travel_date: string;
  arrival_date: string;
  bus_stop: string;
  can_carry_light: boolean;
  can_carry_heavy: boolean;
  min_price: number;
  max_price: number;
  userId: string;
  user_first_name: string;
  user_last_name: string;
  users_phone_number: string;
}

// Define the state type
interface DeliveryParcelState {
  parcels: DeliveryParcel[];
  selectedParcel: DeliveryParcel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: DeliveryParcelState = {
  parcels: [],
  selectedParcel: null,
  status: 'idle',
  error: null,
};

// API base URL
const EXTRA_URL = `/api/deliver`;

// **1. Fetch all delivery parcels**
export const fetchDeliveryParcels = createAsyncThunk<
  DeliveryParcel[],
  void,
  {rejectValue: string}
>('deliveryParcels/fetchAll', async (_, {rejectWithValue}) => {
  try {
    const response = await apiService.get(EXTRA_URL);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **2. Fetch delivery parcels by userId**
export const fetchDeliveryParcelsByUser = createAsyncThunk<
  DeliveryParcel[],
  string,
  {rejectValue: string}
>('deliveryParcels/fetchByUser', async (userId, {rejectWithValue}) => {
  try {
    const response = await apiService.get(`${EXTRA_URL}/deliverparcels/user/${userId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **3. Fetch a delivery parcel by ID**
export const fetchDeliveryParcelById = createAsyncThunk<
  DeliveryParcel,
  string,
  {rejectValue: string}
>('deliveryParcels/fetchById', async (id, {rejectWithValue}) => {
  try {
    const response = await apiService.get(`${EXTRA_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **4. Create a new delivery parcel**
export const createDeliveryParcel = createAsyncThunk<
  DeliveryParcel,
  Omit<DeliveryParcel, '_id'>,
  {rejectValue: string}
>('deliveryParcels/create', async (parcelData, {rejectWithValue}) => {
  try {
    const response = await apiService.post(`${EXTRA_URL}/deliverparcels`, parcelData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **5. Update a delivery parcel**
export const updateDeliveryParcel = createAsyncThunk<
  DeliveryParcel,
  {id: string; parcelData: Partial<DeliveryParcel>},
  {rejectValue: string}
>('deliveryParcels/update', async ({id, parcelData}, {rejectWithValue}) => {
  try {
    const response = await apiService.put(`${EXTRA_URL}/${id}`, parcelData);
    return response.data.updatedParcel;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **6. Delete a delivery parcel**
export const deleteDeliveryParcel = createAsyncThunk<
  string,
  string,
  {rejectValue: string}
>('deliveryParcels/delete', async (id, {rejectWithValue}) => {
  try {
    await apiService.delete(`${EXTRA_URL}/${id}`);
    return id; // Return deleted parcel ID
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **Slice**
const deliverParcelSlice = createSlice({
  name: 'deliveryParcels',
  initialState,
  reducers: {
    clearSelectedParcel: state => {
      state.selectedParcel = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDeliveryParcels.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchDeliveryParcels.fulfilled,
        (state, action: PayloadAction<DeliveryParcel[]>) => {
          state.status = 'succeeded';
          state.parcels = action.payload;
        },
      )
      .addCase(fetchDeliveryParcels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Error fetching parcels';
      })

      .addCase(
        fetchDeliveryParcelById.fulfilled,
        (state, action: PayloadAction<DeliveryParcel>) => {
          state.selectedParcel = action.payload;
        },
      )

      .addCase(
        fetchDeliveryParcelsByUser.fulfilled,
        (state, action: PayloadAction<DeliveryParcel[]>) => {
          state.parcels = action.payload;
        },
      )

      .addCase(
        createDeliveryParcel.fulfilled,
        (state, action: PayloadAction<DeliveryParcel>) => {
          state.parcels.push(action.payload);
        },
      )

      .addCase(
        updateDeliveryParcel.fulfilled,
        (state, action: PayloadAction<DeliveryParcel>) => {
          const index = state.parcels.findIndex(
            p => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.parcels[index] = action.payload;
          }
        },
      )

      .addCase(
        deleteDeliveryParcel.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.parcels = state.parcels.filter(
            parcel => parcel._id !== action.payload,
          );
        },
      );
  },
});

// **Export actions & reducer**
export const {clearSelectedParcel} = deliverParcelSlice.actions;
export default deliverParcelSlice.reducer;
