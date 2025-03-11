import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiService from '../apiService';

// **1. Fetch chat details**
export const fetchChatDetails = createAsyncThunk<
  any, // Replace with the correct type for chat details response
  {type: string; userId: string},
  {rejectValue: string}
>('api/fetchChatDetails', async (params, {rejectWithValue}) => {
  try {apiService
    const response = await apiService.get('/api/chat/details', {
      params: {
        type: params.type,
        userId: params.userId,
      },
    });
    return response.data; // Assuming `data` is the response payload
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **2. Send request**
export const sendRequest = createAsyncThunk<
  any, // Replace with the correct type for request response
  {
    requestId: string;
    type: string;
    chatId: string;
    requestType: string;
    driverId: string;
    amount: number;
    refund: boolean;
    reason: string;
    userId: string;
    ratingCount: number;
  },
  {rejectValue: string}
>('api/sendRequest', async (data, {rejectWithValue}) => {
  try {
    const response = await apiService.post('/api/request/send', data);
    return response.data; // Assuming `data` is the response payload
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **3. Fetch Paystack banks**
export const fetchPaystackBanks = createAsyncThunk<
  any[], // Replace with correct type for the banks data
  void,
  {rejectValue: string}
>('api/fetchPaystackBanks', async (_, {rejectWithValue}) => {
  try {
    const response = await apiService.get('/api/paystack/banks');
    return response.data; // Assuming `data` is the list of banks
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// **4. Resolve Paystack account**
export const resolvePaystackAccount = createAsyncThunk<
  any, // Replace with correct type for the account resolution response
  {accountNumber: string; bankCode: string},
  {rejectValue: string}
>('api/resolvePaystackAccount', async (accountData, {rejectWithValue}) => {
  try {
    const response = await apiService.get('/api/paystack/resolve', {
      params: {
        accountNumber: accountData.accountNumber,
        bankCode: accountData.bankCode,
      },
    });
    return response.data; // Assuming `data` is the resolved account data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const requestWithdrawal = createAsyncThunk(
  'api/requestWithdrawal',
  async (data, {rejectWithValue}) => {
    try {
      const response = await apiService.post(
        '/api/paystack/request-withdrawal',
        data,
      );
      return response.data; // Assuming `data` is the response payload
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// **2. Update Withdrawal Status**
export const updateWithdrawal = createAsyncThunk(
  'api/updateWithdrawal',
  async ({requestId, status}, {rejectWithValue}) => {
    try {
      const response = await apiService.put(
        `/api/paystack/update-withdrawal/${requestId}`,
        {status},
      );
      return response.data; // Assuming `data` is the response payload
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchChatsByFetchID = createAsyncThunk(
  'chat/fetchChatsByFetchID',
  async (fetchID, {rejectWithValue}) => {
    try {
      const response = await apiService.get(`/api-fetch-chat/api/${fetchID}`);
      return response.data; // Chats array from the response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// **2. Fetch chat by chatID**
export const fetchChatByChatID = createAsyncThunk(
  'chat/fetchChatByChatID',
  async (chatID, {rejectWithValue}) => {
    try {
      const response = await apiService.get(`/api-fetch-chat/chat/${chatID}`);
      return response.data; // Chat object from the response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// **3. Set or Update Price for Chat**
export const setPriceForChat = createAsyncThunk(
  'chat/setPriceForChat',
  async ({chatID, price}, {rejectWithValue}) => {
    try {
      const response = await apiService.post('/api-fetch-chat/set-price', {
        chatID,
        price,
      });
      return response.data; // Updated chat object from the response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// **4. Update Chat Data (handle delivery/ride types)**
export const updateChatData = createAsyncThunk(
  'chat/updateChatData',
  async (
    {chatID, type, requestID, driverID, userId, amount},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiService.post('/api-fetch-chat/update-data', {
        chatID,
        type,
        requestID,
        driverID,
        userId,
        amount,
      });
      return response.data; // Updated chat and other related data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// **5. Fetch Chats by User ID**
export const fetchChatsByUserID = createAsyncThunk(
  'chat/fetchChatsByUserID',
  async (userId, {rejectWithValue}) => {
    try {
      const response = await apiService.get(`/api-fetch-chat/chats/${userId}`);
      return response.data; // Chats array from the response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Define the initial state for the Redux slice
const initialState = {
  chatDetails: null,
  requestData: null,
  paystackBanks: [],
  paystackAccount: null,
  loading: false,
  error: null,
};

// Create the Redux slice
const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Fetch chat details
    builder.addCase(fetchChatDetails.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.chatDetails = action.payload;
    });
    builder.addCase(fetchChatDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Send request
    builder.addCase(sendRequest.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.requestData = action.payload;
    });
    builder.addCase(sendRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Paystack banks
    builder.addCase(fetchPaystackBanks.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPaystackBanks.fulfilled, (state, action) => {
      state.loading = false;
      state.paystackBanks = action.payload;
    });
    builder.addCase(fetchPaystackBanks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Resolve Paystack account
    builder.addCase(resolvePaystackAccount.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resolvePaystackAccount.fulfilled, (state, action) => {
      state.loading = false;
      state.paystackAccount = action.payload;
    });
    builder.addCase(resolvePaystackAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Request Withdrawal
    builder.addCase(requestWithdrawal.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestWithdrawal.fulfilled, (state, action) => {
      state.loading = false;
      state.withdrawalData = action.payload;
    });
    builder.addCase(requestWithdrawal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Withdrawal Status
    builder.addCase(updateWithdrawal.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateWithdrawal.fulfilled, (state, action) => {
      state.loading = false;
      state.withdrawalUpdateData = action.payload;
    });
    builder.addCase(updateWithdrawal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Fetch chats by fetchID
    builder.addCase(fetchChatsByFetchID.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatsByFetchID.fulfilled, (state, action) => {
      state.loading = false;
      state.chats = action.payload;
    });
    builder.addCase(fetchChatsByFetchID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch chat by chatID
    builder.addCase(fetchChatByChatID.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatByChatID.fulfilled, (state, action) => {
      state.loading = false;
      state.chatDetails = action.payload;
    });
    builder.addCase(fetchChatByChatID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Set price for chat
    builder.addCase(setPriceForChat.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(setPriceForChat.fulfilled, (state, action) => {
      state.loading = false;
      state.updatedChat = action.payload;
    });
    builder.addCase(setPriceForChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update chat data (delivery/ride)
    builder.addCase(updateChatData.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateChatData.fulfilled, (state, action) => {
      state.loading = false;
      state.updatedChat = action.payload;
    });
    builder.addCase(updateChatData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch chats by userID
    builder.addCase(fetchChatsByUserID.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatsByUserID.fulfilled, (state, action) => {
      state.loading = false;
      state.chats = action.payload;
    });
    builder.addCase(fetchChatsByUserID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions (if needed)
export default apiSlice.reducer;
