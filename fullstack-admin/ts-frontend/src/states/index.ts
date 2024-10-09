import { createSlice } from "@reduxjs/toolkit";
import { BACKEND_MOCK_USER_ID, DARK, LIGHT } from "./constants";
import { PaletteMode } from "@mui/material";

export interface IState {
  mode: PaletteMode;
  userId: string;
}

const initialState: IState = {
  mode: DARK,
  userId: BACKEND_MOCK_USER_ID,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === LIGHT ? DARK : LIGHT;
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
