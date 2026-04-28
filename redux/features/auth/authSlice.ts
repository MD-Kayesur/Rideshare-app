import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

type TAuthState = {
  user: any | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Persistence is handled in the component/thunk usually, 
      // but we can also do it here if we want.
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      SecureStore.deleteItemAsync('accessToken');
      SecureStore.deleteItemAsync('userData');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentUser = (state: { auth: TAuthState }) => state.auth.user;
export const useCurrentToken = (state: { auth: TAuthState }) => state.auth.token;
