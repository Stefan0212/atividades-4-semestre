import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  age: number;
}

interface UserState {
  users: User[];
}

const userSlice = createSlice({
  name: "cadastro",
  initialState: {
    users: [],
  } as UserState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => action.payload !== user.id);
    },
    incrementAge: (state, action: PayloadAction<number>) => {
      const user = state.users.find((user) => action.payload === user.id);
      if (user) {
        user.age = user.age + 1;
      }
    },
  },
});

export const { addUser, removeUser, incrementAge } = userSlice.actions;
export default userSlice.reducer;