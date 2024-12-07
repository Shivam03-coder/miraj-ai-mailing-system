import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateTypes {
  threadId: string | null;
}

const initialState: initialStateTypes = {
  threadId: "",
};

export const accountState = createSlice({
  name: "app-state",
  initialState,
  reducers: {
    setThreadId: (state, action: PayloadAction<string | null>) => {
      state.threadId = action.payload;
    },
  },
});

export const { setThreadId } = accountState.actions;
