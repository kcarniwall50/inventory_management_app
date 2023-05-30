import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",

  isLoggedIn: false,

  user: {
    name: "",
    email: "",
    phone: "",
    photo: "",
    bio: "",
  },
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
      localStorage.setItem("InventoryLoginUser", action.payload);
    },

    setLogin(state, action) {
      state.isLoggedIn = action.payload;
      localStorage.setItem("InventoryLogin",action.payload);

    },

    setUser(state, action) {
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
      state.user.phone = action.payload.phone;
      state.user.photo = action.payload.photo;
      state.user.bio = action.payload.bio;
    },
  },
});

export const { setName, setLogin, setUser } = AuthSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default AuthSlice.reducer;
