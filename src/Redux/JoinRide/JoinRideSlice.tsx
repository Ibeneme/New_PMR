import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiService from '../apiService'; // Import your API service

const PASSENGER_REQUESTS_URL = `/api/passenger`;

export interface PassengerRequest {
  _id: string;
  destination: string;
  travelling_date: string;
  current_city: string;
  userId: string;
  user_first_name: string;
  user_last_name: string;
  users_phone_number: string;
  paid?: boolean;
  amount?: number;
  time_paid?: string;
  driver?: string;
  driver_first_name?: string;
  driver_last_name?: string;
  driver_phone_number?: string;
}

// ** Fetch all passenger requests **
export const fetchPassengerRequests = createAsyncThunk<
  PassengerRequest[],
  void,
  {rejectValue: string}
>('passengerRequests/fetchAll', async (_, {rejectWithValue}) => {
  try {
    const response = await apiService.get(PASSENGER_REQUESTS_URL);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ** Fetch passenger requests by userId **
export const fetchPassengerRequestsByUser = createAsyncThunk<
  PassengerRequest[],
  string,
  {rejectValue: string}
>('passengerRequests/fetchByUser', async (userId, {rejectWithValue}) => {
  try {
    const response = await apiService.get(
      `${PASSENGER_REQUESTS_URL}/user/${userId}`,
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ** Fetch a single passenger request by ID **
export const fetchPassengerRequestById = createAsyncThunk<
  PassengerRequest,
  string,
  {rejectValue: string}
>('passengerRequests/fetchById', async (id, {rejectWithValue}) => {
  try {
    const response = await apiService.get(`${PASSENGER_REQUESTS_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ** Create a new passenger request **
export const createPassengerRequest = createAsyncThunk<
  PassengerRequest,
  Omit<PassengerRequest, '_id'>,
  {rejectValue: string}
>('passengerRequests/create', async (requestData, {rejectWithValue}) => {
  try {
    const response = await apiService.post(
      `${PASSENGER_REQUESTS_URL}/create`,
      requestData,
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ** Update a passenger request **
export const updatePassengerRequest = createAsyncThunk<
  PassengerRequest,
  {id: string; requestData: Partial<PassengerRequest>},
  {rejectValue: string}
>('passengerRequests/update', async ({id, requestData}, {rejectWithValue}) => {
  try {
    const response = await apiService.put(
      `${PASSENGER_REQUESTS_URL}/${id}`,
      requestData,
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ** Delete a passenger request **
export const deletePassengerRequest = createAsyncThunk<
  string,
  string,
  {rejectValue: string}
>('passengerRequests/delete', async (id, {rejectWithValue}) => {
  try {
    await apiService.delete(`${PASSENGER_REQUESTS_URL}/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ** Passenger Requests Slice **
const passengerRequestsSlice = createSlice({
  name: 'passengerRequests',
  initialState: {
    requests: [] as PassengerRequest[],
    request: null as PassengerRequest | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPassengerRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassengerRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchPassengerRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch requests';
      })
      .addCase(fetchPassengerRequestsByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassengerRequestsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchPassengerRequestsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch user requests';
      })
      .addCase(fetchPassengerRequestById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassengerRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload;
      })
      .addCase(fetchPassengerRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch request';
      })
      .addCase(createPassengerRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPassengerRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(createPassengerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create request';
      })
      .addCase(updatePassengerRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassengerRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.map(req =>
          req._id === action.payload._id ? action.payload : req,
        );
      })
      .addCase(updatePassengerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update request';
      })
      .addCase(deletePassengerRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePassengerRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(
          req => req._id !== action.payload,
        );
      })
      .addCase(deletePassengerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete request';
      });
  },
});

export default passengerRequestsSlice.reducer;
