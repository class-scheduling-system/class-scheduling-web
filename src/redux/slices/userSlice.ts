import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfoEntity } from '../../models/entity/user_info_entity';

/**
 * 用户状态接口
 */
export type UserState = {
  currentUser: UserInfoEntity | null;
  isAuthenticated: boolean;
  token: string | null;
}

/**
 * 初始用户状态
 */
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  token: null,
};

/**
 * 用户Slice
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfoEntity>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setUser, setToken, clearUser } = userSlice.actions;
export default userSlice.reducer; 