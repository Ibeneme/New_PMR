import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import apiService from '../apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 📌 Define Parcel Type
interface Parcel {
  _id: string;
  destination: string;
  travelling_date: string;
  current_city: string;
  userId: string;
}

// 📌 Define State Type
interface ParcelState {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// 📌 Initial State
const initialState: ParcelState = {
  parcels: [],
  selectedParcel: null,
  status: 'idle',
  error: null,
};

// 📌 Base API URL
const EXTRA_URL = `/api/parcel`;

// 📌 Fetch all parcels
export const fetchParcels = createAsyncThunk<
  Parcel[],
  void,
  {rejectValue: string}
>('parcels/fetchAll', async (_, {rejectWithValue}) => {
  try {
    const response = await apiService.get(EXTRA_URL);
    return response.data.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

// 📌 Fetch a parcel by ID
export const fetchParcelById = createAsyncThunk<
  Parcel,
  string,
  {rejectValue: string}
>('parcels/fetchById', async (id, {rejectWithValue}) => {
  try {
    const response = await apiService.get(`${EXTRA_URL}/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

// 📌 Fetch parcels by User ID
export const fetchParcelsByUser = createAsyncThunk<
  Parcel[],
  string,
  {rejectValue: string}
>('parcels/fetchByUser', async (userId, {rejectWithValue}) => {
  const accessToken = await AsyncStorage.getItem('temp_id'); // Retrieve the token from AsyncStorage

  if (!accessToken) {
    return rejectWithValue('No access token found');
  }

  try {
    const response = await apiService.get(`${EXTRA_URL}/user/${userId}`);
    console.log(response, 'response');
    return response.data.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

// 📌 Create a new parcel
export const createParcel = createAsyncThunk<
  Parcel,
  Omit<Parcel, '_id'>,
  {rejectValue: string}
>('parcels/create', async (parcelData, {rejectWithValue}) => {
  try {
    const response = await apiService.post(EXTRA_URL, parcelData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

// 📌 Update a parcel
export const updateParcel = createAsyncThunk<
  Parcel,
  {id: string; parcelData: Partial<Parcel>},
  {rejectValue: string}
>('parcels/update', async ({id, parcelData}, {rejectWithValue}) => {
  try {
    const response = await apiService.put(`${EXTRA_URL}/${id}`, parcelData);
    return response.data.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});
interface Driver {
  _id: string;
  name: string;
  location_lat: number;
  location_lng: number;
}

interface NearestDriverState {
  isDriverPaired: boolean;
  pairedDriver: Driver | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// 📌 Fetch Nearest Driver
export const findNearestDriver = createAsyncThunk<
  {isDriverPaired: boolean; pairedDriver: Driver | null},
  {id: string; activeTab: 'sendParcel' | 'joinRide'},
  {rejectValue: string}
>('nearestDriver/find', async (body, {rejectWithValue}) => {
  try {
    const response = await apiService.post(
      `${EXTRA_URL}/find-nearest-driver`,
      body,
    );
    console.log(response.data, 'response.data');
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

// 📌 Delete a parcel
export const deleteParcel = createAsyncThunk<
  string,
  string,
  {rejectValue: string}
>('parcels/delete', async (id, {rejectWithValue}) => {
  try {
    await apiService.delete(`${EXTRA_URL}/${id}`);
    return id; // Return deleted parcel ID
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

// 📌 Slice
const sendParcelSlice = createSlice({
  name: 'parcels',
  initialState,
  reducers: {
    clearSelectedParcel: state => {
      state.selectedParcel = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchParcels.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchParcels.fulfilled,
        (state, action: PayloadAction<Parcel[]>) => {
          state.status = 'succeeded';
          state.parcels = action.payload;
        },
      )
      .addCase(fetchParcels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch parcels';
      })

      .addCase(
        fetchParcelById.fulfilled,
        (state, action: PayloadAction<Parcel>) => {
          state.selectedParcel = action.payload;
        },
      )

      .addCase(
        fetchParcelsByUser.fulfilled,
        (state, action: PayloadAction<Parcel[]>) => {
          state.parcels = action.payload;
        },
      )

      .addCase(
        createParcel.fulfilled,
        (state, action: PayloadAction<Parcel[]>) => {
          state.status = 'succeeded';
          state.parcels = action.payload;
        },
      )

      .addCase(
        updateParcel.fulfilled,
        (state, action: PayloadAction<Parcel>) => {
          const index = state.parcels.findIndex(
            p => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.parcels[index] = action.payload;
          }
        },
      )

      .addCase(
        deleteParcel.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.parcels = state.parcels.filter(
            parcel => parcel._id !== action.payload,
          );
        },
      )
      .addCase(findNearestDriver.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        findNearestDriver.fulfilled,
        (state, action: PayloadAction<Parcel[]>) => {
          state.status = 'succeeded';
          state.parcels = action.payload;
        },
      )
      .addCase(findNearestDriver.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to find the nearest driver';
      });
  },
});

// 📌 Export actions & reducer
export const {clearSelectedParcel} = sendParcelSlice.actions;
export default sendParcelSlice.reducer;
