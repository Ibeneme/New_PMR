import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiService from '../apiService'; // Import the Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
interface AuthState {
  isAuthenticated: boolean;
  user: null | object;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Define the error response type
interface ErrorResponse {
  message: string;
  // Add other properties if required
}

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    userData: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone_number: string;
      referral_code: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await apiService.post('/api/auth/register', userData); // Use the centralized apiService
      console.log(response.data, 'response.data');
      return response.data;
    } catch (error: any) {
      // Typing error as ErrorResponse
      return thunkAPI.rejectWithValue(
        (error.response.data as ErrorResponse).message,
      );
    }
  },
);
export const getUser = createAsyncThunk('auth/getUser', async (_, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('temp_id'); // Retrieve the token from AsyncStorage

    if (!accessToken) {
      return thunkAPI.rejectWithValue('No access token found');
    }

    const response = await apiService.get(`/api/auth/user/${accessToken}`, {});

    return response.data; // Assuming the response contains user data
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Error fetching user',
    );
  }
});
// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: {phone_number: string; password: string}, thunkAPI) => {
    try {
      const response = await apiService.post('/api/auth/login', credentials); // Use the centralized apiService
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        (error.response.data as ErrorResponse).message,
      );
    }
  },
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: {phone_number: string; otp: string}, thunkAPI) => {
    try {
      const response = await apiService.post('/api/auth/verify-otp', otpData); // Use the centralized apiService
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        (error.response.data as ErrorResponse).message,
      );
    }
  },
);

// Verify OTP
export const ChangePassword = createAsyncThunk(
  'auth/ChangePassword',
  async (otpData: {phone_number: string; otp: string}, thunkAPI) => {
    try {
      const response = await apiService.post(
        '/api/auth/confirm-change-password',
        otpData,
      ); // Use the centralized apiService
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        (error.response.data as ErrorResponse).message,
      );
    }
  },
);
// Verify OTP
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (otpData: {phone_number: string; otp: string}, thunkAPI) => {
    try {
      const response = await apiService.post(
        '/api/auth/change-password',
        otpData,
      ); // Use the centralized apiService
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        (error.response.data as ErrorResponse).message,
      );
    }
  },
);

// Resend OTP
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (phone_number: string, thunkAPI) => {
    try {
      const response = await apiService.post('/api/auth/resend-otp', {
        phone_number,
      }); // Use the centralized apiService
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        (error.response.data as ErrorResponse).message,
      );
    }
  },
);
// Route to update user details by ID
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    userData: {
      first_name?: string;
      last_name?: string;
      phone_number?: string;
      email?: string;
      _id?: string
    },
    thunkAPI,
  ) => {
    try {
      
      const response = await apiService.put(
        `/api/auth/user/${userData._id}`,
        userData,
      ); // Use the centralized apiService
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        (error.response.data as ErrorResponse).message,
      );
    }
  },
);
// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: builder => {
    builder
      // Register User
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login User
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Resend OTP
      .addCase(forgotPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }) // Resend OTP
      .addCase(ChangePassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ChangePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(ChangePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Resend OTP
      .addCase(resendOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch user details (getUser)
      .addCase(getUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update user details (updateUser)
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Assuming the updated user is returned
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
