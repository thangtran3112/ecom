import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./index";

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

export type AppStore = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
