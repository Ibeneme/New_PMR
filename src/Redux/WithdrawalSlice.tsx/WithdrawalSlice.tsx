import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../apiService';

// Async Thunks

// Fetch Banks (existing)
export const fetchBanks = createAsyncThunk(
  'paystack/fetchBanks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/paystack/banks');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Error fetching banks'
      );
    }
  }
);

// Resolve Account (existing)
export const resolveAccount = createAsyncThunk(
  'paystack/resolveAccount',
  async ({ account_number, bank_code }: any, { rejectWithValue }) => {
    try {
      console.log(account_number, bank_code);
      const response = await apiService.post('/api/paystack/resolve-account', {
        account_number,
        bank_code
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Error resolving account'
      );
    }
  }
);

// Request Withdrawal
export const requestWithdrawal = createAsyncThunk(
  'paystack/requestWithdrawal',
  async ({
    accountNumber,
    accountName,
    bank,
    bankCode,
    requestedAmount,
    userId,
    withdrawalID
  }: any, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/paystack/request-withdrawal', {
        accountNumber,
        accountName,
        bank,
        bankCode,
        requestedAmount,
        userId,
        withdrawalID
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Error processing withdrawal request'
      );
    }
  }
);

// Slice
const paystackSlice = createSlice({
  name: 'paystack',
  initialState: {
    banks: [],
    accountDetails: null,
    withdrawalStatus: null, // New state to track withdrawal status
    loading: false,
    error: null
  },
  reducers: {
    clearAccountDetails: (state) => {
      state.accountDetails = null;
    },
    clearWithdrawalStatus: (state) => {
      state.withdrawalStatus = null; // Clear the withdrawal status
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Banks
      .addCase(fetchBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = action.payload.data || [];
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resolve Account
      .addCase(resolveAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accountDetails = action.payload.data;
      })
      .addCase(resolveAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Request Withdrawal
      .addCase(requestWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.withdrawalStatus = null; // Reset status on new request
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawalStatus = action.payload.message || 'Withdrawal request submitted successfully.';
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.withdrawalStatus = 'Error processing withdrawal request.';
      });
  }
});

export const { clearAccountDetails, clearWithdrawalStatus } = paystackSlice.actions;
export default paystackSlice.reducer;