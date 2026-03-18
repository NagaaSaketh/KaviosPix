import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import albumReducer from "./albumSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    album: albumReducer,
  },
});
