import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import apiService from '../apiService'; // Assuming you have apiService set up for axios
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for User and State
interface User {
  _id: string;
  email: string;
  fullName: string;
  seen: boolean;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const API_URL = '/api/users'; // Use relative URL, apiService will manage the base URL

// Fetch all users
export const fetchUsers = createAsyncThunk<User[], void, {rejectValue: string}>(
  'users/fetchUsers',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiService.get(API_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching users',
      );
    }
  },
);

// Create or update a user
export const createOrUpdateUser = createAsyncThunk<
  User,
  {email: string; fullName: string},
  {rejectValue: string}
>('users/createOrUpdateUser', async ({email, fullName}, {rejectWithValue}) => {
  try {
    const response = await apiService.post(`${API_URL}/${email}`, {fullName});
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Error creating or updating user',
    );
  }
});
// Fetch user by token
export const fetchUserByToken = createAsyncThunk<
  User,
  void,
  {rejectValue: string}
>('users/fetchUserByToken', async (_, {rejectWithValue}) => {
  try {
    // Retrieve the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('No access token found');
    }

    // Send the request with the token in the Authorization header
    const response = await apiService.post(
      `${API_URL}/users/token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token in the headers
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Error fetching user by token',
    );
  }
});
// Update user seen status
export const updateUserSeenStatus = createAsyncThunk<
  User,
  string,
  {rejectValue: string}
>('users/updateUserSeenStatus', async (userId, {rejectWithValue}) => {
  try {
    const response = await apiService.put(`${API_URL}/put/${userId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Error updating user seen status',
    );
  }
});

// Delete all users
export const deleteAllUsers = createAsyncThunk<
  void,
  void,
  {rejectValue: string}
>('users/deleteAllUsers', async (_, {rejectWithValue}) => {
  try {
    await apiService.delete(API_URL);
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Error deleting all users',
    );
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  } as UserState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOrUpdateUser.pending, state => {
        state.loading = true;
      })
      .addCase(
        createOrUpdateUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          const index = state.users.findIndex(
            user => user._id === action.payload._id,
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          } else {
            state.users.unshift(action.payload);
          }
        },
      )
      .addCase(createOrUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserSeenStatus.pending, state => {
        state.loading = true;
      })
      .addCase(
        updateUserSeenStatus.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          const index = state.users.findIndex(
            user => user._id === action.payload._id,
          );
          if (index !== -1) {
            state.users[index].seen = true;
          }
        },
      )
      .addCase(updateUserSeenStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAllUsers.pending, state => {
        state.loading = true;
      })
      .addCase(deleteAllUsers.fulfilled, state => {
        state.loading = false;
        state.users = [];
      })
      .addCase(deleteAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchUserByToken.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchUserByToken.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        },
      )
      .addCase(fetchUserByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
