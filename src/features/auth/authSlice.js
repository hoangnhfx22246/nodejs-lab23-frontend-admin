import { createSlice } from "@reduxjs/toolkit";
import { setUserLocal, getUserLocal } from "./authLocalStorage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUserLocal() || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      setUserLocal(action.payload);
    },
    removeUser: (state) => {
      state.user = null;
      setUserLocal(null);
    },
  },
});
export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
